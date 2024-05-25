"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tagControllers_1 = __importDefault(require("../controllers/tagControllers"));
const router = (0, express_1.Router)();
router.post('/', tagControllers_1.default.createTag);
router.get('/check/:name', tagControllers_1.default.checkTagExists);
router.get('/parent', tagControllers_1.default.getParentTags);
router.get('/course/:name', tagControllers_1.default.getTagIdByName);
router.get('/modules', tagControllers_1.default.getModules);
router.get('/', tagControllers_1.default.getAllTags);
router.delete('/:name', tagControllers_1.default.deleteTag);
router.get('/courses', tagControllers_1.default.getCourses);
router.get('/submodules', tagControllers_1.default.getSubmodules);
router.put('/:oldName', tagControllers_1.default.updateTagName);
router.put('/type-parent/:name', tagControllers_1.default.updateTagTypeAndParentId);
router.post('/assign-tags', tagControllers_1.default.assignTags);
exports.default = router;
