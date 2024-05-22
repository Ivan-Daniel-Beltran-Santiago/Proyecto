import { Component } from '@angular/core';
import { TagManagerService } from 'src/app/services/TagManager/tag-manager.service';

@Component({
  selector: 'app-tag-manager-edit-tag',
  templateUrl: './tag-manager-edit-tag.component.html',
  styleUrls: ['./tag-manager-edit-tag.component.css']
})
export class TagManagerEditTagComponent {
  selectedCategory: string = '';
  optionSelected: boolean = false;
  selectedCourse: string = '';
  selectedModule: string = '';
  selectedTag: string = '';
  originalSelectedTag: string = '';
  tags: string[] = [];
  courses: string[] = [];
  modules: any[] = [];

  constructor(private tagManagerService: TagManagerService) {}

  ngOnInit(): void {
    this.tagManagerService.getTags().subscribe(tags => {
      this.tags = tags;
    });
    this.tagManagerService.getModules().subscribe(modules => {
      this.modules = modules;
    });
  }
  
  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.selectedCourse = '';
    
    if (this.selectedCategory === 'Nuevo módulo para curso de idiomas' || this.selectedCategory === 'Nuevo submódulo para curso de idiomas') {
      this.tagManagerService.getCourses().subscribe(courses => {
        if (this.selectedCategory === 'Nuevo módulo para curso de idiomas' && this.originalSelectedTag) {
          courses = courses.filter(course => course !== this.originalSelectedTag);
        }
        this.courses = courses;
      });
      
      if (this.selectedCategory === 'Nuevo submódulo para curso de idiomas') {
        this.modules = this.modules.filter(module => module.nombre !== this.originalSelectedTag);
      }
    } else {
      this.courses = [];
      this.modules = [];
    }
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

  onCourseChange(event: any) {
    this.selectedCourse = event.target.value;
  }

  saveChanges() {
    const newName = (document.getElementById('name') as HTMLInputElement).value;
  
    this.tagManagerService.checkTagExists(newName).subscribe(result => {
      if (result.exists && newName !== this.selectedTag) {
        alert('El nombre de etiqueta ya existe. Por favor, elige otro nombre.');
      } else {
        if (this.selectedCategory === 'Nuevo curso de idiomas') {
          this.tagManagerService.updateTagTypeAndParentId(this.selectedTag, 'Curso', null).subscribe(() => {
            this.updateTagNameAndRefreshList(newName);
          });
        } else if (this.selectedCategory === 'Nuevo módulo para curso de idiomas') {
          this.tagManagerService.getTagIdByName(this.selectedCourse, 'Curso').subscribe(courseId => {
            this.tagManagerService.updateTagTypeAndParentId(this.selectedTag, 'Módulo', courseId).subscribe(() => {
              this.updateTagNameAndRefreshList(newName);
            });
          });
        } else if (this.selectedCategory === 'Nuevo submódulo para curso de idiomas') {
          const moduleId = this.modules.find(module => module.nombre === this.selectedModule).id;
          this.tagManagerService.updateTagTypeAndParentId(this.selectedTag, 'Submódulo', moduleId).subscribe(() => {
            this.updateTagNameAndRefreshList(newName);
          });
        } else {
          this.updateTagNameAndRefreshList(newName);
        }
      }
    });
  }  
  
  updateTagNameAndRefreshList(newName: string) {
    this.tagManagerService.updateTagName(this.selectedTag, newName).subscribe(() => {
      this.tagManagerService.getTags().subscribe(tags => {
        this.tags = tags;
      });
      this.selectedCategory = '';
      this.selectedCourse = '';
      this.selectedModule = '';
      this.optionSelected = false;
    });
  }   
}