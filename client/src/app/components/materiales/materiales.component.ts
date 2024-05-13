import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Grupo } from 'src/app/models/grupos';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialesServicesService } from 'src/app/services/materiales/materiales-services.service';
import Swal from 'sweetalert2';
import JSZip from 'jszip';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css'],
})
export class MaterialesComponent {
  @ViewChild('singleInput', { static: false })
  singleInput!: ElementRef;
  arrayClases: any = [];
  arrayMaestros: any = [];
  arrayAlumnos: any = [];
  arrayFiles: any = [];
  allFiles: any = [];
  files: any;
  filesSelected: boolean = false;
  showTagManager: boolean = false;
  id: number = 0;
  idU: any = this.authService.getIdFromToken();
  rol = this.authService.getRoleFromToken();
  click: boolean = false;
  agregarGrupo: boolean = false;
  courseTags: any[] = [];
  idGrupo: any;
  isAdmin = this.authService.isAdmin();
  isMaestro = this.authService.isMaestro();
  isAlumno = this.authService.isAlumno();
  nombreUsuario = this.authService.getNameFromToken();
  grupo: Grupo = {
    nombre_grupo: '',
    fecha_inicio: '',
    fecha_final: '',
  };
  constructor(
    private router: Router,
    private authService: AuthService,
    private materialService: MaterialesServicesService
  ) {}

  ngOnInit() {
    this.getCourseTags();
    this.materialService.getFiles().subscribe((files) => {
      this.arrayFiles = this.processFiles(files);
      this.allFiles = files;
    });
  }

  getCourseTags() {
    this.materialService.getCourseTags().subscribe(
      (tags) => {
        this.courseTags = tags;
      },
      (error) => {
        console.error('Error al obtener las etiquetas de curso:', error);
        // Manejar el error adecuadamente (por ejemplo, mostrar un mensaje al usuario)
      }
    );
  }

  logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  selectFiles(event: any) {
    this.filesSelected =
      event.target.files.length > 0 || this.arrayFiles.length > 0;
    if (this.filesSelected) {
      this.files = event.target.files;
      console.log(this.files);
      // Agrega validación para tipos de archivo aceptables
      for (let i = 0; i < this.files.length; i++) {
        const fileType = this.files[i].type;
        const allowedFileTypes = [
          'application/pdf',
          'audio/mpeg',
          'image/jpeg',
          'image/png',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'video/mp4',
          'video/mpeg',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];
        if (!allowedFileTypes.includes(fileType)) {
          // Mostrar mensaje de error o realizar alguna acción
          console.log('Tipo de archivo no válido');
          return;
        }
      }
    }
  }

  onSubmitFiles() {
    if (!this.filesSelected) {
      return;
    }

    if (this.files.length === 0) {
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append('files', this.files[i]);
    }

    this.materialService.postFiles(formData).subscribe(
      (res: any) => {
        console.log(res.paths);
        this.singleInput.nativeElement.value = '';

        // Después de subir los archivos, actualiza la lista de archivos
        this.updateFiles();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getFileUrl(filename: string): string {
    return `http://localhost:3000/uploads/${filename}`;
  }

  viewFile(filename: string) {
    const fileUrl = this.getFileUrl(filename);
    window.open(fileUrl, '_blank'); // Abre el archivo en una nueva pestaña del navegador
  }

  deleteFile(filename: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres borrar este archivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.materialService.deleteFile(filename).subscribe({
          next: () => {
            // Mostrar un mensaje de éxito
            Swal.fire(
              '¡Borrado!',
              'El archivo ha sido borrado correctamente.',
              'success'
            );
            // Después de la eliminación exitosa, actualiza la lista de archivos
            this.updateFiles();
          },
          error: (err: any) => {
            console.error(err);
            Swal.fire(
              'Error',
              'Hubo un problema al intentar borrar el archivo.',
              'error'
            );
          },
        });
      }
    });
  }

  updateFiles() {
    this.materialService.getFiles().subscribe((files) => {
      this.arrayFiles = this.processFiles(files);
      this.allFiles = files;
    });
  }

  async downloadAllFiles() {
    const zip = new JSZip();
    const folder = zip.folder('archivos');
    for (const file of this.arrayFiles) {
      const response = await fetch(this.getFileUrl(file));
      const blob = await response.blob();
      folder?.file(file, blob);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos_los_archivos.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  searchFiles(searchText: string) {
    let filteredFiles = this.allFiles; // Inicialmente, todos los archivos están visibles

    // Aplicar el filtro por tipo de archivo seleccionado
    const fileTypeFilter = (
      document.getElementById('location') as HTMLSelectElement
    ).value;
    if (fileTypeFilter && fileTypeFilter !== '') {
      if (fileTypeFilter === 'Documento Word') {
        filteredFiles = filteredFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.docx')
        );
      } else if (fileTypeFilter === 'PDF') {
        filteredFiles = filteredFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.pdf')
        );
      } else if (fileTypeFilter === 'Audio') {
        filteredFiles = filteredFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.mp3')
        );
      } else if (fileTypeFilter === 'Video') {
        filteredFiles = filteredFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.mp4')
        );
      } else if (fileTypeFilter === 'PowerPoint') {
        filteredFiles = filteredFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.pptx')
        );
      } else if (fileTypeFilter === 'Imagen') {
        filteredFiles = filteredFiles.filter((file: any) => {
          const extension = file.name.nombre.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png'].includes(extension);
        });
      }
    }

    // Aplicar la búsqueda de texto sobre los archivos filtrados por tipo de archivo
    if (searchText.trim()) {
      filteredFiles = filteredFiles.filter((file: any) => {
        return file.name.nombre
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }

    // Actualizar la lista de archivos para mostrar solo los archivos que pasaron los filtros
    this.arrayFiles = filteredFiles;
  }

  filterFilesByType(event: Event) {
    const target = event.target as HTMLSelectElement;
    const fileType = target.value;

    if (!fileType) {
      // Si no se ha seleccionado ningún tipo, mostrar todos los archivos de la lista completa
      this.arrayFiles = this.allFiles;
    } else {
      // Filtrar los archivos en función del tipo seleccionado sobre la lista completa
      if (fileType === 'Documento Word') {
        // Filtrar por tipo de archivo y extensión .docx
        this.arrayFiles = this.allFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.docx')
        );
      } else if (fileType === 'PDF') {
        // Filtrar por tipo de archivo y extensión .pdf
        this.arrayFiles = this.allFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.pdf')
        );
      } else if (fileType === 'Audio') {
        // Filtrar por tipo de archivo de audio
        this.arrayFiles = this.allFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.mp3')
        );
      } else if (fileType === 'Video') {
        // Filtrar por tipo de archivo de video
        this.arrayFiles = this.allFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.mp4')
        );
      } else if (fileType === 'PowerPoint') {
        // Filtrar por tipo de archivo de presentación de PowerPoint
        this.arrayFiles = this.allFiles.filter((file: any) =>
          file.name.nombre.toLowerCase().endsWith('.pptx')
        );
      } else if (fileType === 'Imagen') {
        // Filtrar por tipo de archivo de imagen (JPEG o PNG)
        this.arrayFiles = this.allFiles.filter(
          (file: any) =>
            file.name.nombre.toLowerCase().endsWith('.jpg') ||
            file.name.nombre.toLowerCase().endsWith('.jpeg') ||
            file.name.nombre.toLowerCase().endsWith('.png')
        );
      }
    }
  }

  toggleTagManager() {
    this.showTagManager = !this.showTagManager;
  }

  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'mp3':
        return 'Audio';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'Imagen';
      case 'docx':
        return 'Documento Word';
      case 'mp4':
      case 'mpeg':
        return 'Video';
      case 'pptx':
        return 'PowerPoint';
      default:
        return 'Desconocido';
    }
  }

  // Método para procesar los archivos y establecer su tipo
  processFiles(files: any[]) {
    return files.map((file) => ({
      ...file,
      type: this.getFileType(file.name.nombre),
      etiquetas: file.etiquetas,
    }));
  }

  eliminarEtiqueta(file: any, index: number) {
    const etiquetaEliminada = file.etiquetas[index];
    this.materialService
      .deleteEtiqueta(file.name.nombre, etiquetaEliminada)
      .subscribe({
        next: () => {
          // Elimina la etiqueta del array de etiquetas del archivo
          file.etiquetas.splice(index, 1);
          // Actualiza la lista de archivos después de eliminar la etiqueta
          this.updateFiles();
          // Muestra un mensaje de éxito
          Swal.fire(
            'Éxito',
            'La(s) etiqueta(s) ha(n) sido eliminada(s) correctamente',
            'success'
          );
        },
        error: (err: any) => {
          console.error(err);
          // Muestra un mensaje de error si hay algún problema
          Swal.fire(
            'Error',
            'Hubo un problema al intentar eliminar la etiqueta',
            'error'
          );
        },
      });
  }
}
