// Compatibility shims for WebContainer package replacements
import { PackageRequirement } from './packageManager';

// Generate compatibility shims for replaced packages
function generateCompatibilityShims(detectedPackages: PackageRequirement[]): string {
  const shims: string[] = [];
  
  // Check if bcrypt was requested and replaced with bcryptjs
  const hasBcrypt = detectedPackages.some(pkg => pkg.name === 'bcryptjs');
  if (hasBcrypt) {
    shims.push(`
// bcrypt compatibility shim - makes bcryptjs work as drop-in replacement
const bcryptjs = require('bcryptjs');
const bcrypt = {
  hash: bcryptjs.hash,
  hashSync: bcryptjs.hashSync,
  compare: bcryptjs.compare,
  compareSync: bcryptjs.compareSync,
  genSalt: bcryptjs.genSalt,
  genSaltSync: bcryptjs.genSaltSync,
  getRounds: bcryptjs.getRounds
};`);
  }

  // Check if Prisma Client is being used
  const hasPrisma = detectedPackages.some(pkg => pkg.name === '@prisma/client');
  if (hasPrisma) {
    shims.push(`
// Prisma Client mock for WebContainer compatibility
class PrismaClientMock {
  constructor(options = {}) {
    this.options = options;
    this._data = {
      user: [
        { id: 1, email: "alice@example.com", name: "Alice Johnson", username: "alice_dev", createdAt: new Date(), isActive: true },
        { id: 2, email: "bob@example.com", name: "Bob Smith", username: "bob_coder", createdAt: new Date(), isActive: true }
      ],
      task: [
        { id: 1, title: "Learn Node.js", description: "Complete Node.js tutorial", completed: false, priority: "HIGH", userId: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: "Build REST API", description: "Create production API", completed: true, priority: "MEDIUM", userId: 2, createdAt: new Date(), updatedAt: new Date() }
      ]
    };
    
    // Generate model methods dynamically
    this.user = this._createModel('user');
    this.task = this._createModel('task');
  }

  _createModel(modelName) {
    const self = this;
    return {
      async create(params) {
        const { data, include } = params;
        const newId = Math.max(...self._data[modelName].map(item => item.id), 0) + 1;
        const newItem = {
          id: newId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        self._data[modelName].push(newItem);
        
        if (include) {
          return self._applyIncludes(newItem, include, modelName);
        }
        return newItem;
      },

      async findMany(params = {}) {
        const { where, include, orderBy, skip = 0, take } = params;
        let results = [...self._data[modelName]];
        
        if (where) {
          results = results.filter(item => self._matchesWhere(item, where));
        }
        
        if (orderBy) {
          results = self._applyOrderBy(results, orderBy);
        }
        
        if (skip > 0) {
          results = results.slice(skip);
        }
        
        if (take) {
          results = results.slice(0, take);
        }
        
        if (include) {
          results = results.map(item => self._applyIncludes(item, include, modelName));
        }
        
        return results;
      },

      async findUnique(params) {
        const { where, include } = params;
        const result = self._data[modelName].find(item => self._matchesWhere(item, where));
        
        if (!result) return null;
        
        if (include) {
          return self._applyIncludes(result, include, modelName);
        }
        return result;
      },

      async update(params) {
        const { where, data, include } = params;
        const item = self._data[modelName].find(item => self._matchesWhere(item, where));
        
        if (!item) {
          throw new Error('Record not found');
        }
        
        Object.assign(item, data, { updatedAt: new Date() });
        
        if (include) {
          return self._applyIncludes(item, include, modelName);
        }
        return item;
      },

      async delete(params) {
        const { where } = params;
        const index = self._data[modelName].findIndex(item => self._matchesWhere(item, where));
        
        if (index === -1) {
          throw new Error('Record not found');
        }
        
        return self._data[modelName].splice(index, 1)[0];
      },

      async count(params = {}) {
        const { where } = params;
        let results = [...self._data[modelName]];
        
        if (where) {
          results = results.filter(item => self._matchesWhere(item, where));
        }
        
        return results.length;
      },

      async deleteMany(params = {}) {
        const { where } = params;
        const originalLength = self._data[modelName].length;
        
        if (where) {
          self._data[modelName] = self._data[modelName].filter(item => !self._matchesWhere(item, where));
        } else {
          self._data[modelName] = [];
        }
        
        return { count: originalLength - self._data[modelName].length };
      }
    };
  }

  _matchesWhere(item, where) {
    return Object.keys(where).every(key => {
      if (typeof where[key] === 'object' && where[key] !== null) {
        // Handle operators like { gte: value }, { contains: value }, etc.
        return Object.keys(where[key]).every(op => {
          switch (op) {
            case 'gte': return item[key] >= where[key][op];
            case 'gt': return item[key] > where[key][op];
            case 'lte': return item[key] <= where[key][op];
            case 'lt': return item[key] < where[key][op];
            case 'contains': return String(item[key]).includes(where[key][op]);
            case 'startsWith': return String(item[key]).startsWith(where[key][op]);
            case 'endsWith': return String(item[key]).endsWith(where[key][op]);
            case 'not': return item[key] !== where[key][op];
            default: return item[key] === where[key][op];
          }
        });
      }
      return item[key] === where[key];
    });
  }

  _applyOrderBy(results, orderBy) {
    return results.sort((a, b) => {
      for (const [field, direction] of Object.entries(orderBy)) {
        const multiplier = direction === 'desc' ? -1 : 1;
        if (a[field] < b[field]) return -1 * multiplier;
        if (a[field] > b[field]) return 1 * multiplier;
      }
      return 0;
    });
  }

  _applyIncludes(item, include, modelName) {
    const result = { ...item };
    
    // Mock relationships - in a real app, this would be much more sophisticated
    if (include.user && modelName === 'task') {
      result.user = this._data.user.find(u => u.id === item.userId);
    }
    if (include.tasks && modelName === 'user') {
      result.tasks = this._data.task.filter(t => t.userId === item.id);
    }
    
    return result;
  }

  async $disconnect() {
    // Mock disconnect - does nothing in our simulation
    console.log('📊 Prisma Client disconnected (simulated)');
  }

  async $connect() {
    // Mock connect - does nothing in our simulation
    console.log('📊 Prisma Client connected (simulated)');
  }
}

// Export the mock
const { PrismaClient } = { PrismaClient: PrismaClientMock };`);
  }

  // Override require for replaced packages
  if (hasBcrypt || hasPrisma) {
    shims.push(`
// Override require to return our compatibility layers
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'bcrypt' && typeof bcrypt !== 'undefined') {
    return bcrypt;
  }
  if (id === '@prisma/client' && typeof PrismaClient !== 'undefined') {
    return { PrismaClient };
  }
  return originalRequire.apply(this, arguments);
};`);
  }
  
  return shims.join('\n');
}

export { generateCompatibilityShims };