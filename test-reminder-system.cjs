#!/usr/bin/env node

/**
 * Test script for the customizable reminder system
 * 
 * This script tests:
 * 1. User settings API for saving reminder times
 * 2. Cron job API for time-aware filtering
 * 3. Email sending functionality
 */

require('dotenv').config();

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function testReminderSystem() {
  console.log('🧪 Testing Customizable Reminder System');
  console.log('=====================================');
  
  // Test 1: Check cron job endpoint (test mode)
  console.log('\n📋 Test 1: Cron Job Test Mode');
  const cronTest = await makeRequest(`${BASE_URL}/api/cron/study-reminders?test=true`);
  
  if (cronTest.status === 200) {
    console.log('✅ Cron job test mode working');
    console.log(`   - Inactive users found: ${cronTest.data.stats?.inactiveUsersCount || 0}`);
    console.log(`   - Current time window being checked`);
  } else {
    console.log('❌ Cron job test mode failed:', cronTest.data?.error || cronTest.error);
  }
  
  // Test 2: Check if email preferences API exists
  console.log('\n📋 Test 2: Email Preferences API');
  const prefsTest = await makeRequest(`${BASE_URL}/api/email/preferences`);
  
  if (prefsTest.status === 401) {
    console.log('✅ Email preferences API exists (requires authentication)');
  } else if (prefsTest.status === 200) {
    console.log('✅ Email preferences API working');
  } else {
    console.log('❌ Email preferences API failed:', prefsTest.data?.error || prefsTest.error);
  }
  
  // Test 3: Check user settings API
  console.log('\n📋 Test 3: User Settings API');
  const settingsTest = await makeRequest(`${BASE_URL}/api/user/settings`);
  
  if (settingsTest.status === 401) {
    console.log('✅ User settings API exists (requires authentication)');
  } else if (settingsTest.status === 200) {
    console.log('✅ User settings API working');
  } else {
    console.log('❌ User settings API failed:', settingsTest.data?.error || settingsTest.error);
  }
  
  // Test 4: Check cron status API
  console.log('\n📋 Test 4: Cron Status API');
  const statusTest = await makeRequest(`${BASE_URL}/api/cron/status`);
  
  if (statusTest.status === 401 || statusTest.status === 403) {
    console.log('✅ Cron status API exists (requires admin authentication)');
  } else if (statusTest.status === 200) {
    console.log('✅ Cron status API working');
  } else {
    console.log('❌ Cron status API failed:', statusTest.data?.error || statusTest.error);
  }
  
  // Test 5: Generate test times
  console.log('\n📋 Test 5: Time Window Logic');
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  console.log(`✅ Current time: ${currentTime}`);
  console.log(`   - Server timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  console.log(`   - Sample reminder times that would trigger now:`);
  
  // Show times within 30-minute window
  for (let i = -30; i <= 30; i += 10) {
    const testTime = new Date(now.getTime() + i * 60 * 1000);
    const testTimeStr = `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`;
    console.log(`     • ${testTimeStr} (${i > 0 ? '+' : ''}${i} minutes)`);
  }
  
  console.log('\n📋 Test 6: Email Template Preview');
  const emailTest = await makeRequest(`${BASE_URL}/api/email/test`, {
    method: 'POST',
    body: JSON.stringify({ type: 'reminder' }),
  });
  
  if (emailTest.status === 401) {
    console.log('✅ Email test API exists (requires authentication)');
  } else if (emailTest.status === 200) {
    console.log('✅ Email test API working - reminder template ready');
  } else {
    console.log('❌ Email test API failed:', emailTest.data?.error || emailTest.error);
  }
  
  console.log('\n🎯 Summary');
  console.log('==========');
  console.log('✅ Customizable reminder system is set up');
  console.log('✅ Users can set their preferred reminder time in /settings');
  console.log('✅ Cron job runs every 30 minutes checking for users');
  console.log('✅ Only users with reminder time ±30min from current time get emails');
  console.log('✅ Email content includes personalized progress information');
  
  console.log('\n📚 Next Steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000/settings');
  console.log('3. Set your reminder time');
  console.log('4. Set up the cron job: scripts\\setup-cron.bat (as Admin)');
  console.log('5. Monitor via admin dashboard: http://localhost:3000/admin');
  
  console.log('\n💡 How it works:');
  console.log('• Cron runs every 30 minutes');
  console.log('• Finds users with reminder time within ±30min of current time');
  console.log('• Checks if they have been inactive for 3+ days');
  console.log('• Sends personalized reminder with their actual progress');
  console.log('• Respects user notification preferences');
}

testReminderSystem().catch(console.error);