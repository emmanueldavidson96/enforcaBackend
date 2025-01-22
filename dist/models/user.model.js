"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.AccountType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var AccountType;
(function (AccountType) {
    AccountType["Company"] = "company";
    AccountType["Seeker"] = "seeker";
})(AccountType || (exports.AccountType = AccountType = {}));
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["User"] = "user";
})(Role || (exports.Role = Role = {}));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    accountType: {
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.Seeker
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.User
    },
    isAdmin: {
        type: String,
        default: false
    },
    userImageUrl: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
    userDescription: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("User", userSchema);
