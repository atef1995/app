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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var allChallenges, _i, allChallenges_1, challengeData, baseSlug, slug, challenge, _a, _b, _c, moodId, adaptation, _d, _e, test_1, error_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log("🔄 Restoring challenges...");
                    // Delete all existing challenges first
                    return [4 /*yield*/, prisma.challengeAttempt.deleteMany()];
                case 1:
                    // Delete all existing challenges first
                    _f.sent();
                    return [4 /*yield*/, prisma.challengeTest.deleteMany()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, prisma.challengeMoodAdaptation.deleteMany()];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, prisma.challenge.deleteMany()];
                case 4:
                    _f.sent();
                    console.log("🗑️ Cleared existing challenge data");
                    allChallenges = __spreadArray(__spreadArray([], basic_1.basicChallenges, true), algorithms_1.algorithmChallenges, true);
                    _i = 0, allChallenges_1 = allChallenges;
                    _f.label = 5;
                case 5:
                    if (!(_i < allChallenges_1.length)) return [3 /*break*/, 19];
                    challengeData = allChallenges_1[_i];
                    _f.label = 6;
                case 6:
                    _f.trys.push([6, 17, , 18]);
                    console.log("\uD83D\uDCDD Creating challenge: ".concat(challengeData.title));
                    baseSlug = (0, slugify_1.slugify)(challengeData.title);
                    return [4 /*yield*/, (0, slugify_1.generateUniqueSlug)(baseSlug, 'challenge')];
                case 7:
                    slug = _f.sent();
                    return [4 /*yield*/, prisma.challenge.create({
                            data: {
                                slug: slug,
                                title: challengeData.title,
                                description: challengeData.description,
                                difficulty: challengeData.difficulty,
                                category: challengeData.category,
                                initialCode: challengeData.initialCode,
                                solution: challengeData.solution,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 8:
                    challenge = _f.sent();
                    _a = 0, _b = Object.entries(challengeData.moodAdapted);
                    _f.label = 9;
                case 9:
                    if (!(_a < _b.length)) return [3 /*break*/, 12];
                    _c = _b[_a], moodId = _c[0], adaptation = _c[1];
                    return [4 /*yield*/, prisma.challengeMoodAdaptation.create({
                            data: {
                                challengeId: challenge.id,
                                moodId: moodId,
                                title: adaptation.title,
                                description: adaptation.description,
                                timerSeconds: adaptation.timerSeconds,
                                hints: adaptation.hints || [],
                            },
                        })];
                case 10:
                    _f.sent();
                    _f.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12:
                    _d = 0, _e = challengeData.tests;
                    _f.label = 13;
                case 13:
                    if (!(_d < _e.length)) return [3 /*break*/, 16];
                    test_1 = _e[_d];
                    return [4 /*yield*/, prisma.challengeTest.create({
                            data: {
                                challengeId: challenge.id,
                                input: typeof test_1.input === 'string' ? test_1.input : JSON.stringify(test_1.input),
                                expected: typeof test_1.expected === 'string' ? test_1.expected : JSON.stringify(test_1.expected),
                                description: test_1.description,
                            },
                        })];
                case 14:
                    _f.sent();
                    _f.label = 15;
                case 15:
                    _d++;
                    return [3 /*break*/, 13];
                case 16:
                    console.log("\u2705 Created challenge: ".concat(challenge.title, " (").concat(challenge.slug, ")"));
                    return [3 /*break*/, 18];
                case 17:
                    error_1 = _f.sent();
                    console.error("\u274C Error creating challenge ".concat(challengeData.title, ":"), error_1);
                    return [3 /*break*/, 18];
                case 18:
                    _i++;
                    return [3 /*break*/, 5];
                case 19:
                    console.log("🎉 Challenge restoration complete!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("❌ Error during challenge restoration:", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
