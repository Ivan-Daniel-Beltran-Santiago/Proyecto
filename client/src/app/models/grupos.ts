export interface Grupo {
  id_grupo?: number;
  nombre_grupo: string;
  categoria?: string;
  idioma?: number;
  id_maestro?: number;
  id_maestro2?: number;
  fecha_inicio: string;
  fecha_revision?: string;
  fecha_final: string;
  modulo_idioma?: number;
  submodulo_idioma?: number;
}
