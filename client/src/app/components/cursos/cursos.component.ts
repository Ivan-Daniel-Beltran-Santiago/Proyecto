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
  selectedCourse: string | undefined;
  modules: any[] = [];
  selectedModule: string | undefined;

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
                        tagData.type = 'Submódulo'; // Tipo de etiqueta
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
}
