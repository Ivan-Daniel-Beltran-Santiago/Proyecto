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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class TagController {
    createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Recibida solicitud para crear etiqueta");
            try {
                const { name, type, parent_id } = req.body;
                yield database_1.default.query("INSERT INTO Etiquetas (nombre, tipo, padre_id) VALUES (?, ?, ?)", [name, type, parent_id]);
                res.status(201).json({ message: "Etiqueta creada exitosamente" });
            }
            catch (error) {
                console.error("Error al crear la etiqueta:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    checkTagExists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const result = yield database_1.default.query("SELECT COUNT(*) as count FROM Etiquetas WHERE nombre = ?", [name]);
                const exists = result[0][0].count > 0; // Accede al primer elemento del primer array
                res.json({ exists });
            }
            catch (error) {
                console.error("Error al verificar la existencia de la etiqueta:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getParentTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parentTags = yield database_1.default.query("SELECT nombre FROM Etiquetas WHERE padre_id IS NULL");
                const tags = parentTags[0].map((tag) => tag.nombre);
                res.json(tags);
            }
            catch (error) {
                console.error("Error al obtener las etiquetas principales:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getTagIdByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                let query = "SELECT id FROM Etiquetas WHERE nombre = ?";
                // Si el tipo es un curso o un módulo, agrega la condición del tipo
                if (req.query.type === "Curso" || req.query.type === "Módulo") {
                    query += " AND tipo = ?";
                    const result = yield database_1.default.query(query, [
                        name,
                        req.query.type,
                    ]);
                    if (result[0].length > 0) {
                        res.json(result[0][0].id);
                    }
                    else {
                        res.json(null); // Devuelve null si no se encuentra el curso o módulo
                    }
                }
                else {
                    const result = yield database_1.default.query(query, [name]);
                    if (result[0].length > 0) {
                        res.json(result[0][0].id);
                    }
                    else {
                        res.json(null); // Devuelve null si no se encuentra el curso o módulo
                    }
                }
            }
            catch (error) {
                console.error("Error al obtener el ID del curso o módulo por nombre:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getModules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modules = yield database_1.default.query("SELECT id, nombre FROM Etiquetas WHERE tipo = 'Módulo'");
                res.json(modules[0]);
            }
            catch (error) {
                console.error("Error al obtener los módulos:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield database_1.default.query("SELECT nombre FROM Etiquetas");
                if (Array.isArray(result[0])) {
                    const tags = result[0].map((tag) => tag.nombre);
                    res.json(tags);
                }
                else {
                    res.status(500).json({ error: "Error interno del servidor" });
                }
            }
            catch (error) {
                console.error("Error al obtener las etiquetas:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    deleteTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                // Función recursiva para eliminar etiquetas hijo
                const deleteChildTags = (tagId) => __awaiter(this, void 0, void 0, function* () {
                    // Buscar y eliminar las etiquetas hijo
                    const childTagsToDelete = yield database_1.default.query("SELECT id FROM Etiquetas WHERE padre_id = ?", [tagId]);
                    for (const childTag of childTagsToDelete[0]) {
                        yield deleteChildTags(childTag.id);
                        yield database_1.default.query("DELETE FROM Etiquetas WHERE id = ?", [childTag.id]);
                    }
                });
                // Buscar el ID de la etiqueta a eliminar
                const tagToDelete = yield database_1.default.query("SELECT id FROM Etiquetas WHERE nombre = ?", [name]);
                const tagId = tagToDelete[0][0].id; // Accede al primer elemento del primer array
                // Llamar a la función recursiva para eliminar las etiquetas hijo
                yield deleteChildTags(tagId);
                // Eliminar la etiqueta principal
                yield database_1.default.query("DELETE FROM Etiquetas WHERE nombre = ?", [name]);
                res
                    .status(200)
                    .json({ message: "Etiqueta y etiquetas hijo eliminadas exitosamente" });
            }
            catch (error) {
                console.error("Error al eliminar la etiqueta y etiquetas hijo:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield database_1.default.query("SELECT DISTINCT nombre FROM Etiquetas WHERE tipo = 'Curso'");
                if (Array.isArray(courses[0])) {
                    const courseNames = courses[0].map((course) => course.nombre);
                    res.json(courseNames);
                }
                else {
                    res.status(500).json({ error: "Error interno del servidor" });
                }
            }
            catch (error) {
                console.error("Error al obtener los cursos:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    updateTagName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldName } = req.params;
                const { newName } = req.body;
                yield database_1.default.query("UPDATE Etiquetas SET nombre = ? WHERE nombre = ?", [
                    newName,
                    oldName,
                ]);
                res
                    .status(200)
                    .json({ message: "Nombre de etiqueta actualizado exitosamente" });
            }
            catch (error) {
                console.error("Error al actualizar el nombre de la etiqueta:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    updateTagTypeAndParentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const { type, parentId } = req.body;
                // Función recursiva para eliminar etiquetas hijo
                const deleteChildTags = (tagId) => __awaiter(this, void 0, void 0, function* () {
                    // Buscar y eliminar las etiquetas hijo
                    const childTagsToDelete = yield database_1.default.query("SELECT id FROM Etiquetas WHERE padre_id = ?", [tagId]);
                    for (const childTag of childTagsToDelete[0]) {
                        yield deleteChildTags(childTag.id);
                        yield database_1.default.query("DELETE FROM Etiquetas WHERE id = ?", [childTag.id]);
                    }
                });
                // Buscar el ID de la etiqueta a actualizar
                const tagToUpdate = yield database_1.default.query("SELECT id FROM Etiquetas WHERE nombre = ?", [name]);
                const tagId = tagToUpdate[0][0].id; // Accede al primer elemento del primer array
                // Llamar a la función recursiva para eliminar las etiquetas hijo
                yield deleteChildTags(tagId);
                // Actualizar el tipo de etiqueta y el padre_id
                let query = "UPDATE Etiquetas SET tipo = ?";
                const params = [type];
                if (parentId === null || parentId === undefined) {
                    query += ", padre_id = NULL";
                }
                else {
                    query += ", padre_id = ?";
                    params.push(parentId);
                }
                query += " WHERE nombre = ?";
                params.push(name);
                yield database_1.default.query(query, params);
                res.status(200).json({
                    message: "Tipo y padre_id de etiqueta actualizados exitosamente",
                });
            }
            catch (error) {
                console.error("Error al actualizar el tipo y padre_id de la etiqueta:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    assignTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tagId, fileIds } = req.body;
                // Itera sobre los IDs de archivos y verifica si alguna etiqueta ya está asignada
                for (const fileId of fileIds) {
                    // Verifica si el archivo ya tiene asignada una etiqueta de tipo "Curso"
                    const existingCourseTag = yield database_1.default.query("SELECT COUNT(*) as count FROM Asignacion_Etiquetas ae INNER JOIN Etiquetas e ON ae.etiqueta_id = e.id WHERE ae.archivo_id = ? AND e.tipo = 'Curso'", [fileId]);
                    if (existingCourseTag[0][0].count > 0) {
                        // Si ya tiene asignada una etiqueta de tipo "Curso", enviar un mensaje de advertencia
                        res.status(400).json({
                            error: "No se puede asignar más etiquetas de tipo 'Curso' al archivo",
                        });
                        return;
                    }
                    // Si no existe una asignación de etiqueta de tipo "Curso", proceder con la asignación
                    yield database_1.default.query("INSERT INTO Asignacion_Etiquetas (archivo_id, etiqueta_id) VALUES (?, ?)", [fileId, tagId]);
                }
                res.status(200).json({ message: "Etiquetas asignadas exitosamente" });
            }
            catch (error) {
                console.error("Error al asignar etiquetas:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
}
exports.default = new TagController();
