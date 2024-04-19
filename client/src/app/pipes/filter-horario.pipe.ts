import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterHorario',
})
export class FilterHorarioPipe implements PipeTransform {
  transform(
    value: any,
    args: any,
    clases: any[],
    usuarios: any[],
    grupos: any
  ): any {
    if (!Array.isArray(value)) {
      return []; // Otra acción adecuada en caso de que value no sea un array
    }

    let resultPost = [];
    for (let post of value) {
      const maestroMatches = this.obtenerNombreMaestro(
        post.id_grupo,
        clases,
        usuarios
      )
        .toLowerCase()
        .includes(args.toLowerCase());
      const maestroMatches2 = this.obtenerNombreMaestro2(
        post.id_grupo,
        clases,
        usuarios
      )
        .toLowerCase()
        .includes(args.toLowerCase());
      const grupoMatches = this.obtenerNombreGrupo(post.id_grupo, grupos)
        .toLowerCase()
        .includes(args.toLowerCase());
      if (maestroMatches || grupoMatches || maestroMatches2) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }

  obtenerNombreMaestro(
    idGrupo: number,
    clases: any[],
    usuarios: any[]
  ): string {
    // Verificar si clases y usuarios tienen datos
    if (!clases || !usuarios) {
      return ''; // Manejo de caso donde clases o usuarios sean undefined
    }

    const clase = clases.find((c) => c.id_grupo === idGrupo);

    if (clase) {
      const idMaestro = clase.id_maestro;
      const usuario = usuarios.find((u) => u.id_user === idMaestro);
      return usuario ? usuario.first_nameU : '';
    }

    return '';
  }

  obtenerNombreMaestro2(
    idGrupo: number,
    clases: any[],
    usuarios: any[]
  ): string {
    // Verificar si clases y usuarios tienen datos
    if (!clases || !usuarios) {
      return ''; // Manejo de caso donde clases o usuarios sean undefined
    }

    const clase = clases.find((c) => c.id_grupo === idGrupo);

    if (clase) {
      const idMaestro2 = clase.id_maestro;
      const usuario = usuarios.find((u) => u.id_user === idMaestro2);
      return usuario ? usuario.first_nameU : '';
    }

    return '';
  }

  obtenerNombreGrupo(idGrupo: number, grupos: { id_grupo: number, nombre_grupo: string }[][]): string {
    if (!grupos || grupos.length === 0 || !Array.isArray(grupos[0])) {
      return 'Datos de grupos no disponibles o en formato incorrecto';
    }
  
    const grupo = grupos[0].find((g) => g.id_grupo === idGrupo);
    return grupo ? `${grupo.nombre_grupo}` : 'Grupo no encontrado';
  }  
}
