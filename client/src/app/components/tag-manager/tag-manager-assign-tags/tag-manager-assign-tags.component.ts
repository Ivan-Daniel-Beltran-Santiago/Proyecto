import { Component, OnInit } from '@angular/core';
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
  tags: string[] = [];
  location: string = '';
  selectedTag: number | null = null;
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    private materialesService: MaterialesServicesService,
    private tagManagerService: TagManagerService
  ) {}

  onSelectOption(event: any) {
    if (event && event.target) {
      const selectedOption = event.target.value;
      this.selectedTag = event.target.value;
      const selectedIndex = this.tags.findIndex(
        (tag) => tag === selectedOption
      );
      const selectedTagType = this.tags[selectedIndex];
      if (selectedTagType) {
        this.tagManagerService
          .getTagIdByName(selectedOption, selectedOption)
          .subscribe(
            (tagId) => {
              console.log('ID de la etiqueta:', tagId);
              console.log('Nombre de la etiqueta:', selectedOption);
              this.selectedTag = tagId;
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
    this.getAllTags();
  }

  getFiles() {
    this.materialesService.getFiles().subscribe(
      (files) => {
        this.arrayFiles = files.map((file) => ({
          id: file.name.id,
          name: file.name.nombre,
        }));
        this.filteredFiles = [...this.arrayFiles];
        this.checkIfChecked();
      },
      (err) => console.error(err)
    );
  }

  getAllTags() {
    this.tagManagerService.getTags().subscribe(
      (tags) => {
        this.tags = tags;
      },
      (err) => console.error(err)
    );
  }

  toggleCheckbox(file: any) {
    file.checked = !file.checked;
    this.checkIfChecked();
  }

  checkIfChecked() {
    this.atLeastOneChecked = this.filteredFiles.some((file) => file.checked);
  }

  filterFiles(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(query);
  }

  filterByFileType(event: Event) {
    const selectedFileType = (event.target as HTMLSelectElement).value;
    this.selectedFileType = selectedFileType;
    this.applyFilters(this.searchTerm);
  }

  applyFilters(query: string) {
    if (query.trim() === '') {
      if (this.selectedFileType) {
        const fileExtensions = this.getFileExtension(this.selectedFileType);
        if (fileExtensions) {
          const extensions = fileExtensions.split(',');
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
      if (this.selectedFileType) {
        const fileExtensions = this.getFileExtension(this.selectedFileType);
        if (fileExtensions) {
          const extensions = fileExtensions.split(',');
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
    const selectedFiles = this.filteredFiles.filter((file) => file.checked);
    if (selectedFiles.length === 0 || !this.selectedTag) return;

    const tagData = {
      tagName: this.selectedTag,
      fileIds: selectedFiles.map((file) => file.id),
    };

    this.tagManagerService
      .assignTags(
        this.selectedTag,
        selectedFiles.map((file) => file.id)
      )
      .subscribe(
        () => {
          console.log('Etiquetas asignadas exitosamente');
        },
        (error) => {
          if (error.status === 400 && error.error.error) {
            this.showAlert = true;
            this.alertMessage = error.error.error;
          } else {
            console.error('Error al asignar etiquetas:', error);
          }
        }
      );
  }
}
