import { Component } from '@angular/core';
import { TagManagerService } from 'src/app/services/TagManager/tag-manager.service';
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

  constructor(private tagManagerService: TagManagerService) {
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
        this.tagManagerService.getTags().subscribe((tags) => {
          this.tags = tags;
        });
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
}
