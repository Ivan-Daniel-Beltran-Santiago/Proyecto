import { Router } from 'express';
import tagController from '../controllers/tagControllers';

const router = Router();

router.post('/', tagController.createTag);
router.get('/check/:name', tagController.checkTagExists);
router.get('/parent', tagController.getParentTags);
router.get('/course/:name', tagController.getTagIdByName);
router.get('/modules', tagController.getModules);

router.get('/', tagController.getAllTags);

router.delete('/:name', tagController.deleteTag);

router.get('/courses', tagController.getCourses);

router.put('/:oldName', tagController.updateTagName);
router.put('/type-parent/:name', tagController.updateTagTypeAndParentId);

router.post('/assign-tags', tagController.assignTags);

export default router;
