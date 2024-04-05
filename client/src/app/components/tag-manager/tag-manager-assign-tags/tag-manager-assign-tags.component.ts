import { Component, OnInit, HostListener } from '@angular/core';
import { MaterialesServicesService } from 'src/app/services/materiales/materiales-services.service';
import { TagManagerService } from 'src/app/services/TagManager/tag-manager.service';

@Component({
  selector: 'app-tag-manager-assign-tags',
  templateUrl: './tag-manager-assign-tags.component.html',
  styleUrls: ['./tag-manager-assign-tags.component.css'],
})
export class TagManagerAssignTagsComponent implements OnInit {
  optionSelected: boolean = false;
  atLeastOneChecked: boolean = false;
  numOptions: number = 0;
  arrayFiles: any[] = [];
  filteredFiles: any[] = [];
  searchTerm: string = '';
  selectedFileType: string | null = null;
  tags: string[] = []; // Variable para almacenar las etiquetas

  constructor(
    private materialesService: MaterialesServicesService,
    private tagManagerService: TagManagerService
  ) {}

  onSelectOption(event: any) {
    if (event && event.target) { // Verificar si event y event.target son definidos
      const selectedOption = event.target.value;
      const selectedTag = this.tags.find(tag => tag === selectedOption);
      if (selectedTag) {
        // Modifica esta línea para proporcionar el tipo "Curso"
        this.tagManagerService.getTagIdByName(selectedTag, 'Curso').subscribe(
          (tagId) => {
            console.log('ID de la etiqueta:', tagId);
            console.log('Nombre de la etiqueta:', selectedTag);
            console.log('Tipo de la etiqueta: Curso');
          },
          (err) => console.error(err)
        );
      }
      this.optionSelected = true;
      this.checkIfChecked();
    }
  }

  ngOnInit(): void {
    this.getFiles();
    this.getAllTags(); // Llama al método para obtener todas las etiquetas al iniciar el componente
  }

  getFiles() {
    this.materialesService.getFiles().subscribe(
      (files) => {
        this.arrayFiles = files.map((file, index) => ({
          id: index + 1, // Podrías asignar un ID único a cada archivo aquí
          name: file.name,
          type: file.type // Asegúrate de tener el tipo de archivo disponible aquí
        }));
        // Inicialmente, mostrar todos los archivos sin filtrar
        this.filteredFiles = [...this.arrayFiles];
        // Verificar si hay al menos un archivo seleccionado
        this.checkIfChecked();
      },
      (err) => console.error(err)
    );
  }  

  getAllTags() {
    this.tagManagerService.getTags().subscribe(
      (tags) => {
        this.tags = tags; // Asigna las etiquetas obtenidas a la variable del componente
      },
      (err) => console.error(err)
    );
  }

  toggleCheckbox(file: any) {
    file.checked = !file.checked; // Cambia el estado de selección del archivo
    this.checkIfChecked(); // Verifica si al menos un archivo está seleccionado
  }

  // Método para verificar si hay al menos un archivo seleccionado
  checkIfChecked() {
    this.atLeastOneChecked = this.filteredFiles.some((file) => file.checked);
  }

  // Método para filtrar archivos según la consulta de búsqueda y el tipo de archivo seleccionado
  filterFiles(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(query);
  }

  // Método para filtrar archivos por tipo de archivo seleccionado
  filterByFileType(event: Event) {
    const selectedFileType = (event.target as HTMLSelectElement).value;
    this.selectedFileType = selectedFileType;
    this.applyFilters(this.searchTerm);
  }

  applyFilters(query: string) {
    if (query.trim() === '') {
      // Si la consulta está vacía, mostrar todos los archivos sin filtrar
      if (this.selectedFileType) {
        const fileExtensions = this.getFileExtension(this.selectedFileType);
        if (fileExtensions) {
          const extensions = fileExtensions.split(','); // Separar las extensiones por coma
          this.filteredFiles = this.arrayFiles.filter((file) =>
            extensions.some((extension) =>
              file.name.toLowerCase().endsWith(`.${extension}`)
            )
          );
        }
      } else {
        this.filteredFiles = [...this.arrayFiles];
      }
    } else {
      // Filtrar archivos que coincidan con la consulta y el tipo de archivo seleccionado
      if (this.selectedFileType) {
        const fileExtensions = this.getFileExtension(this.selectedFileType);
        if (fileExtensions) {
          const extensions = fileExtensions.split(','); // Separar las extensiones por coma
          this.filteredFiles = this.arrayFiles.filter((file) =>
            extensions.some(
              (extension) =>
                file.name.toLowerCase().endsWith(`.${extension}`) &&
                file.name.toLowerCase().includes(query)
            )
          );
        }
      } else {
        this.filteredFiles = this.arrayFiles.filter((file) =>
          file.name.toLowerCase().includes(query)
        );
      }
    }
  }

  getFileExtension(fileType: string): string | null {
    switch (fileType) {
      case 'Documento Word':
        return 'docx';
      case 'PDF':
        return 'pdf';
      case 'Audio':
        return 'mp3';
      case 'Video':
        return 'mp4';
      case 'PowerPoint':
        return 'pptx';
      case 'Imagen':
        return 'jpg,png';
      default:
        return null;
    }
  }

  assignTags() {
    for (const file of this.filteredFiles) {
      if (file.checked) {
        console.log('ID del archivo:', file.id); // Suponiendo que cada archivo tiene un campo 'id'
        console.log('Nombre del archivo:', file.name);
        console.log('Tipo del archivo:', file.type);
      }
    }
  }
}
