import { Component } from '@angular/core';
import { TagManagerService } from 'src/app/services/TagManager/tag-manager.service';
import { MaterialesServicesService } from 'src/app/services/materiales/materiales-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
})
export class CursosComponent {
  parentTags: string[] = [];
  selectedCategory: string | undefined;
  selectedSubCategory: string | undefined;
  isSubcategorySelectorValid: boolean = false;
  selectedCourse: string;
  modules: any[] = [];
  selectedModule: string;
  optionSelected: boolean = false;
  originalSelectedTag: string = '';
  selectedTag: string = '';
  tags: string[] = [];
  courses: string[] = [];
  selectedFileType: string | null = null;
  filteredFiles: any[] = [];
  arrayFiles: any[] = [];
  searchTerm: string = '';
  atLeastOneChecked: boolean = false;
  tagSelected: number | null = null;

  constructor(
    private materialesService: MaterialesServicesService,
    private tagManagerService: TagManagerService
  ) {
    this.selectedCategory = '';
    this.selectedSubCategory = '';
    this.selectedCourse = '';
    this.selectedModule = '';
  }

  ngOnInit(): void {
    this.loadParentTags();
    this.tagManagerService.getParentTags().subscribe((tags) => {
      this.parentTags = tags;
    });
    this.tagManagerService.getTags().subscribe((tags) => {
      this.tags = tags;
    });
    this.tagManagerService.getModules().subscribe((modules) => {
      this.modules = modules;
    });
    this.getFiles();
  }

  loadParentTags() {
    this.tagManagerService.getParentTags().subscribe((tags) => {
      this.parentTags = tags;
    });
  }

  onCategoryChange() {
    if (this.selectedCategory === 'Nuevo módulo para curso de idiomas') {
      this.selectedSubCategory = '';
    } else if (
      this.selectedCategory === 'Nuevo submódulo para curso de idiomas'
    ) {
      this.loadModules();
    }
  }

  loadModules() {
    this.tagManagerService.getModules().subscribe(
      (modules) => {
        this.modules = modules;
      },
      (error) => {
        console.error('Error al obtener los módulos:', error);
      }
    );
  }

  validateSubcategorySelector() {
    if (this.selectedCategory === 'Nuevo curso de idiomas') {
      return true;
    } else if (this.selectedCategory === 'Nuevo módulo para curso de idiomas') {
      return true;
    } else if (
      this.selectedCategory === 'Nuevo submódulo para curso de idiomas'
    ) {
      return this.selectedSubCategory !== undefined;
    }
    return false;
  }

  createTag() {
    const tagName = (
      document.getElementById('name') as HTMLInputElement
    ).value.trim();
    if (!tagName) {
      Swal.fire(
        'Error',
        'Por favor, ingrese un nombre para la etiqueta.',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Deseas crear la etiqueta?',
      text: 'Estás a punto de crear una nueva etiqueta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear etiqueta',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tagManagerService.checkTagExists(tagName).subscribe(
          (response) => {
            if (response.exists) {
              Swal.fire(
                'Error',
                'Ya existe una etiqueta con este nombre.',
                'error'
              );
            } else {
              const tagData = {
                name: tagName,
                type: 'Curso',
                parent_id: null as number | null,
              };

              if (
                this.selectedCategory === 'Nuevo módulo para curso de idiomas'
              ) {
                if (!this.selectedCourse) {
                  Swal.fire(
                    'Error',
                    'Por favor, selecciona un curso.',
                    'error'
                  );
                  return;
                }
                this.tagManagerService
                  .getTagIdByName(this.selectedCourse, 'Curso')
                  .subscribe(
                    (courseId) => {
                      if (courseId) {
                        tagData.type = 'Módulo';
                        tagData.parent_id = courseId;
                        this.createTagWithParent(tagData);
                      } else {
                        Swal.fire(
                          'Error',
                          'No se pudo encontrar el ID del curso seleccionado.',
                          'error'
                        );
                      }
                    },
                    (error) => {
                      console.error('Error al obtener el ID del curso:', error);
                      Swal.fire(
                        'Error',
                        'Error al obtener el ID del curso.',
                        'error'
                      );
                    }
                  );
              } else if (
                this.selectedCategory ===
                'Nuevo submódulo para curso de idiomas'
              ) {
                if (!this.selectedSubCategory) {
                  Swal.fire(
                    'Error',
                    'Por favor, selecciona un módulo.',
                    'error'
                  );
                  return;
                }
                this.tagManagerService
                  .getTagIdByName(this.selectedSubCategory, 'Módulo')
                  .subscribe(
                    (moduleId) => {
                      if (moduleId) {
                        tagData.type = 'Submódulo';
                        tagData.parent_id = moduleId;
                        this.createTagWithParent(tagData);
                      } else {
                        Swal.fire(
                          'Error',
                          'No se pudo encontrar el ID del módulo seleccionado.',
                          'error'
                        );
                      }
                    },
                    (error) => {
                      console.error(
                        'Error al obtener el ID del módulo:',
                        error
                      );
                      Swal.fire(
                        'Error',
                        'Error al obtener el ID del módulo.',
                        'error'
                      );
                    }
                  );
              } else {
                this.createTagWithParent(tagData);
              }
            }
          },
          (error) => {
            console.error(
              'Error al verificar la existencia de la etiqueta:',
              error
            );
            Swal.fire(
              'Error',
              'Error al verificar la existencia de la etiqueta.',
              'error'
            );
          }
        );
      }
    });
  }

  createTagWithParent(tagData: any) {
    this.tagManagerService.postTag(tagData).subscribe(
      (response) => {
        Swal.fire('Éxito', 'Etiqueta creada exitosamente.', 'success');
        this.loadParentTags();
      },
      (error) => {
        console.error('Error al crear la etiqueta:', error);
        Swal.fire('Error', 'Error al crear la etiqueta.', 'error');
      }
    );
  }

  onSelectOption() {
    this.optionSelected = true;
    this.originalSelectedTag = this.selectedTag;
    this.selectedCategory = '';
    this.selectedCourse = '';
    this.selectedModule = '';
  }

  onInputChange(event: any) {
    this.selectedTag = this.originalSelectedTag;
  }

  saveChanges() {
    const newName = (
      document.getElementById('new_tag_name') as HTMLInputElement
    ).value.trim();
    if (!newName) {
      Swal.fire(
        'Error',
        'El nombre de la etiqueta no puede estar vacío.',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Deseas editar la etiqueta?',
      text: 'Estás a punto de editar la etiqueta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar etiqueta',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tagManagerService.checkTagExists(newName).subscribe(
          (result) => {
            if (result.exists && newName !== this.selectedTag) {
              Swal.fire(
                'Error',
                'El nombre de etiqueta ya existe. Por favor, elige otro nombre.',
                'error'
              );
            } else {
              if (this.selectedCategory === 'Nuevo curso de idiomas') {
                this.tagManagerService
                  .updateTagTypeAndParentId(this.selectedTag, 'Curso', null)
                  .subscribe(
                    () => {
                      this.updateTagNameAndRefreshList(newName);
                    },
                    (error) => {
                      Swal.fire(
                        'Error',
                        'Error al actualizar la etiqueta.',
                        'error'
                      );
                    }
                  );
              } else if (
                this.selectedCategory === 'Nuevo módulo para curso de idiomas'
              ) {
                this.tagManagerService
                  .getTagIdByName(this.selectedCourse, 'Curso')
                  .subscribe(
                    (courseId) => {
                      this.tagManagerService
                        .updateTagTypeAndParentId(
                          this.selectedTag,
                          'Módulo',
                          courseId
                        )
                        .subscribe(
                          () => {
                            this.updateTagNameAndRefreshList(newName);
                          },
                          (error) => {
                            Swal.fire(
                              'Error',
                              'Error al actualizar la etiqueta.',
                              'error'
                            );
                          }
                        );
                    },
                    (error) => {
                      Swal.fire(
                        'Error',
                        'Error al obtener el ID del curso.',
                        'error'
                      );
                    }
                  );
              } else if (
                this.selectedCategory ===
                'Nuevo submódulo para curso de idiomas'
              ) {
                const moduleId = this.modules.find(
                  (module) => module.nombre === this.selectedModule
                ).id;
                this.tagManagerService
                  .updateTagTypeAndParentId(
                    this.selectedTag,
                    'Submódulo',
                    moduleId
                  )
                  .subscribe(
                    () => {
                      this.updateTagNameAndRefreshList(newName);
                    },
                    (error) => {
                      Swal.fire(
                        'Error',
                        'Error al actualizar la etiqueta.',
                        'error'
                      );
                    }
                  );
              } else {
                this.updateTagNameAndRefreshList(newName);
              }
            }
          },
          (error) => {
            Swal.fire(
              'Error',
              'Error al verificar la existencia de la etiqueta.',
              'error'
            );
          }
        );
      }
    });
  }

  updateTagNameAndRefreshList(newName: string) {
    this.tagManagerService.updateTagName(this.selectedTag, newName).subscribe(
      () => {
        Swal.fire('Éxito', 'Etiqueta editada exitosamente.', 'success');
        this.selectedCategory = '';
        this.selectedCourse = '';
        this.selectedModule = '';
        this.optionSelected = false;
      },
      (error) => {
        Swal.fire(
          'Error',
          'Error al actualizar el nombre de la etiqueta.',
          'error'
        );
      }
    );
  }

  deleteSelectedTag(): void {
    if (this.selectedTag) {
      Swal.fire({
        title: '¿Deseas eliminar la etiqueta?',
        text: 'Estás a punto de eliminar esta etiqueta.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar etiqueta',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.tagManagerService.deleteTag(this.selectedTag).subscribe(
            () => {
              Swal.fire('Éxito', 'Etiqueta eliminada exitosamente.', 'success');
              this.selectedTag = '';
              this.loadParentTags();
              this.tagManagerService.getTags().subscribe((tags) => {
                this.tags = tags;
              });
            },
            (error) => {
              console.error('Error al eliminar la etiqueta:', error);
              Swal.fire('Error', 'Error al eliminar la etiqueta.', 'error');
            }
          );
        }
      });
    }
  }

  onSelectedOption(event: any) {
    if (event && event.target) {
      const selectedOption = event.target.value;
      this.tagSelected = event.target.value;
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
              this.tagSelected = tagId;
            },
            (err) => console.error(err)
          );
      }
      this.optionSelected = true;
      this.checkIfChecked();
    }
  }

  toggleCheckbox(file: any) {
    file.checked = !file.checked;
    this.checkIfChecked();
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

  checkIfChecked() {
    this.atLeastOneChecked = this.filteredFiles.some((file) => file.checked);
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
    Swal.fire({
      title: '¿Deseas asignar la etiqueta?',
      text: 'Estás a punto de asignar la etiqueta a los archivos seleccionados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar etiqueta',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedFiles = this.filteredFiles.filter((file) => file.checked);
        if (selectedFiles.length === 0 || !this.tagSelected) {
          Swal.fire(
            'Error',
            'Debes seleccionar al menos un archivo y una etiqueta.',
            'error'
          );
          return;
        }

        this.tagManagerService
          .assignTags(
            this.tagSelected,
            selectedFiles.map((file) => file.id)
          )
          .subscribe(
            () => {
              Swal.fire('Éxito', 'Etiqueta asignada exitosamente.', 'success');
            },
            (error) => {
              console.error('Error al asignar etiquetas:', error);
              Swal.fire('Error', 'Error al asignar etiquetas.', 'error');
            }
          );
      }
    });
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
}
