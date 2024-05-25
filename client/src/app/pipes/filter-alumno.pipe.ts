import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAlumno',
})
export class FilterAlumnoPipe implements PipeTransform {
  transform(value: any, args: any): any {
    let resultPost = [];
    for (let post of value) {
      if (
        post.first_name_A.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.last_name_A.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.telephone_A.indexOf(args) > -1
      ) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }
}
