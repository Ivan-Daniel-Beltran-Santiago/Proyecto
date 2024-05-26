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
exports.userController = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_config_1 = __importDefault(require("../nodemailer-config"));
class UserController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield database_1.default.query("SELECT * FROM users");
                res.json(user);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const user = yield database_1.default.query("SELECT * FROM users WHERE id_user=?", [id]);
                res.json(user);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = req.body.password;
            const password = yield bcrypt_1.default.hash(req.body.password, 10);
            req.body.password = password;
            const id = req.body.id;
            const email = req.body.email;
            try {
                yield database_1.default.query("INSERT INTO users SET ?", [req.body]);
                console.log(req.body);
                res.json({ text: "User saved" });
                const mailOptions = {
                    from: "kenalexmv@gmail.com",
                    to: email,
                    subject: "Registro Exitoso",
                    text: `Gracias por ser parte  de Innova Language Solutions 
          Nuestros clientes son los mas importante para nosotros. 
          Acceso a la plataforma
          email: ${email}
          contraseña : ` + pass,
                };
                nodemailer_config_1.default.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico de registro:", error);
                        return res.status(400).send("Error al enviar el correo electrónico");
                    }
                    console.log("Correo electrónico enviado: " + info.response);
                    res.status(200).send("Registro exitoso, correo electrónico enviado");
                });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield database_1.default.query("DELETE FROM users WHERE id_user = ?", [id]);
                res.json({ text: "User deleted" });
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                res.status(500).send("Error interno del servidor");
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const contraNueva = req.body.password;
            const password = yield bcrypt_1.default.hash(req.body.password, 10);
            req.body.password = password;
            const datos = req.body;
            try {
                yield database_1.default.query("UPDATE users SET ? WHERE id_user = ?", [datos, id]);
                let email = req.body.email;
                const mailOptions = {
                    from: "kenalexmv@gmail.com",
                    to: email,
                    subject: "Actualizacion Exitoso",
                    text: `Se ha actualizado tu perfil tu nuevo acceso a la 
          plataforma 
          email: ${email}
          contraseña : ` + contraNueva,
                };
                nodemailer_config_1.default.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico de registro:", error);
                        return res.status(500).send("Error al enviar el correo electrónico");
                    }
                    console.log("Correo electrónico enviado: " + info.response);
                    res.status(200).send("Registro exitoso, correo electrónico enviado");
                });
                res.json({ message: "User updated" });
            }
            catch (error) {
                res.status(400).json({
                    msg: "Favor de llenar todos los datos ",
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const correo = req.body.email;
                const contraseña = req.body.password;
                const usuario = yield database_1.default.query("Select * from users where email =?", [correo]);
                let rol = yield database_1.default.query("Select id_rol from users where email =?", [
                    correo,
                ]);
                let nombre = yield database_1.default.query("Select first_nameU,last_nameU from users where email =?", [correo]);
                let nombreU = JSON.parse(JSON.stringify(nombre[0]));
                let data = JSON.parse(JSON.stringify(usuario[0]));
                let role = JSON.parse(JSON.stringify(rol[0]));
                console.log(data[0]);
                console.log(role[0]);
                if (!data[0]) {
                    return res.status(400).json({
                        msg: "No existe correo en la base de datos",
                    });
                }
                console.log(contraseña);
                {
                    console.log(data[0].password);
                }
                const passwordValid = yield bcrypt_1.default.compare(contraseña, data[0].password);
                console.log(passwordValid);
                if (!passwordValid) {
                    return res.status(400).json({
                        msg: "Password incorrecta",
                    });
                }
                const token = jsonwebtoken_1.default.sign({
                    email: correo,
                    nombre: JSON.parse(JSON.stringify(nombreU[0].first_nameU + "  " + nombreU[0].last_nameU)),
                    rol: JSON.parse(JSON.stringify(role[0].id_rol)),
                    id: JSON.parse(JSON.stringify(data[0].id_user)),
                }, process.env.SECRET_KEY || "pGZLwuX!rt9");
                console.log(token);
                res.json(token);
            }
            catch (error) {
                console.error("Error al ejecutar la consulta MySQL:", error);
                return res.status(500).json({
                    msg: "Error Interno del Servidor",
                });
            }
        });
    }
}
exports.userController = new UserController();
exports.default = exports.userController;
