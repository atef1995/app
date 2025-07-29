"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var basic_1 = require("../src/data/challenges/basic");
var algorithms_1 = require("../src/data/challenges/algorithms");
var slugify_1 = require("../src/lib/slugify");
var prisma = new client_1.PrismaClient();
function restoreAllChallenges() {
    return __awaiter(this, void 0, void 0, function () {
        var allChallenges, _i, allChallenges_1, challenge, slug, isPremium, requiredPlan, createdChallenge, _a, _b, _c, mood, content, i, test_1, challengeCount, moodAdaptationCount, testCount, premiumChallenges, freeChallenges, challenges, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("🚀 Starting comprehensive challenge restoration...");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 20, 21, 23]);
                    allChallenges = __spreadArray(__spreadArray([], basic_1.basicChallenges, true), algorithms_1.algorithmChallenges, true);
                    console.log("\uD83D\uDCCA Found ".concat(allChallenges.length, " challenges to restore"));
                    _i = 0, allChallenges_1 = allChallenges;
                    _d.label = 2;
                case 2:
                    if (!(_i < allChallenges_1.length)) return [3 /*break*/, 13];
                    challenge = allChallenges_1[_i];
                    console.log("\n\u26A1 Restoring challenge: ".concat(challenge.title));
                    slug = (0, slugify_1.slugify)(challenge.title);
                    isPremium = challenge.difficulty === "hard";
                    requiredPlan = challenge.difficulty === "hard"
                        ? "CRACKED"
                        : challenge.difficulty === "medium"
                            ? "VIBED"
                            : "FREE";
                    return [4 /*yield*/, prisma.challenge.create({
                            data: {
                                slug: slug,
                                title: challenge.title,
                                description: challenge.description,
                                difficulty: challenge.difficulty.toUpperCase(),
                                type: challenge.type.toUpperCase(),
                                estimatedTime: challenge.estimatedTime,
                                starter: challenge.starter,
                                solution: challenge.solution,
                                order: parseInt(challenge.id),
                                published: true,
                                isPremium: isPremium,
                                requiredPlan: requiredPlan,
                            },
                        })];
                case 3:
                    createdChallenge = _d.sent();
                    console.log("\u2705 Created challenge: ".concat(createdChallenge.title, " (").concat(createdChallenge.slug, ")"));
                    _a = 0, _b = Object.entries(challenge.moodAdapted);
                    _d.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_a], mood = _c[0], content = _c[1];
                    return [4 /*yield*/, prisma.challengeMoodAdaptation.create({
                            data: {
                                challengeId: createdChallenge.id,
                                mood: mood.toUpperCase(),
                                content: content,
                            },
                        })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _a++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("\uD83C\uDFA8 Added mood adaptations for ".concat(Object.keys(challenge.moodAdapted).length, " moods"));
                    i = 0;
                    _d.label = 8;
                case 8:
                    if (!(i < challenge.tests.length)) return [3 /*break*/, 11];
                    test_1 = challenge.tests[i];
                    return [4 /*yield*/, prisma.challengeTest.create({
                            data: {
                                challengeId: createdChallenge.id,
                                input: JSON.parse(JSON.stringify(test_1.input)),
                                expected: JSON.parse(JSON.stringify(test_1.expected)),
                                description: test_1.description,
                                order: i,
                            },
                        })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log("\uD83E\uDDEA Added ".concat(challenge.tests.length, " test cases"));
                    _d.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 2];
                case 13: return [4 /*yield*/, prisma.challenge.count()];
                case 14:
                    challengeCount = _d.sent();
                    return [4 /*yield*/, prisma.challengeMoodAdaptation.count()];
                case 15:
                    moodAdaptationCount = _d.sent();
                    return [4 /*yield*/, prisma.challengeTest.count()];
                case 16:
                    testCount = _d.sent();
                    console.log("\n🎉 Challenge restoration completed successfully!");
                    console.log("\uD83D\uDCC8 Summary:");
                    console.log("   - Challenges: ".concat(challengeCount));
                    console.log("   - Mood adaptations: ".concat(moodAdaptationCount));
                    console.log("   - Test cases: ".concat(testCount));
                    return [4 /*yield*/, prisma.challenge.count({
                            where: { isPremium: true },
                        })];
                case 17:
                    premiumChallenges = _d.sent();
                    return [4 /*yield*/, prisma.challenge.count({
                            where: { isPremium: false },
                        })];
                case 18:
                    freeChallenges = _d.sent();
                    console.log("\n\uD83D\uDC8E Premium breakdown:");
                    console.log("   - FREE challenges: ".concat(freeChallenges));
                    console.log("   - VIBED/CRACKED challenges: ".concat(premiumChallenges));
                    return [4 /*yield*/, prisma.challenge.findMany({
                            orderBy: { order: "asc" },
                            select: {
                                id: true,
                                slug: true,
                                title: true,
                                difficulty: true,
                                isPremium: true,
                                requiredPlan: true,
                                order: true,
                            },
                        })];
                case 19:
                    challenges = _d.sent();
                    console.log("\n📋 Restored challenges:");
                    challenges.forEach(function (challenge) {
                        var premiumIcon = challenge.isPremium ? "💎" : "🆓";
                        console.log("   ".concat(premiumIcon, " ").concat(challenge.order, ". ").concat(challenge.title, " (").concat(challenge.difficulty, ") - ").concat(challenge.requiredPlan));
                    });
                    return [3 /*break*/, 23];
                case 20:
                    error_1 = _d.sent();
                    console.error("❌ Error during challenge restoration:", error_1);
                    throw error_1;
                case 21: return [4 /*yield*/, prisma.$disconnect()];
                case 22:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
}
// Run the restoration
restoreAllChallenges()
    .then(function () {
    console.log("\n✨ All challenges have been successfully restored!");
    process.exit(0);
})
    .catch(function (error) {
    console.error("💥 Restoration failed:", error);
    process.exit(1);
});
