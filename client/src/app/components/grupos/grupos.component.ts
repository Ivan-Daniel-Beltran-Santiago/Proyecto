import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GruposService } from 'src/app/services/grupos/grupos.service';
import { MaestrosService } from 'src/app/services/maestros/maestros.service';
import { Grupo } from 'src/app/models/grupos';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
})
export class GruposComponent implements OnInit {
  arrayGrupos : any =[];
  arrayMaestros:any = [];
  edit:boolean = false;
  idG : any ;

  grupo : Grupo ={
    nombre_grupo : "",
    categoria:"",
    Idioma:"",
    fecha_inicio:'',
    fecha_final:'',
    id_maestro:0,
    id_maestro2:0,
   

  }
  constructor(private gruposService:GruposService , private maestrosService:MaestrosService,private authService: AuthService,private router:Router) {}

  ngOnInit() {
    
    this.gruposService.getGrupos().subscribe(
      (res) => {
        this.arrayGrupos = res;
       console.log(res);
      },

      (err) => console.error(err)
    );

    this.maestrosService.getMaestros().subscribe(

      (res) => {
        this.arrayMaestros = res;
        console.log(res);
      }, 
      (err) => console.error(err)
    );
  }

  nombreUsuario = this.authService.getNameFromToken();



logout(): void {
    this.authService.removeToken(); // Elimina el token al cerrar sesión
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }

  obtenerGrupo(id:number){
    const objeto: any = {};
    this.idG = id;
    

    
      this.gruposService.getGrupo(id.toString()).subscribe((res) => {
        
        this.edit = true;
        this.arrayGrupos=res;
        for (let i = 0; i < this.arrayGrupos[0].length; i++) {
          objeto[i] = this.arrayGrupos[0][i];
          this.grupo.fecha_inicio=objeto[i].fecha_inicio.substring(10,0)
          this.grupo.fecha_final=objeto[i].fecha_final.substring(10,0)
          
        }
        console.log(objeto);
        console.log(this.grupo.fecha_inicio);
       
        
        this.grupo = objeto[0];
        console.log(id);
      });
    
  }

  recargar(){
    
          
      location.reload();
    
  }

  actualizarGrupo(){
    this.gruposService.updateGrupo(this.idG,this.grupo).subscribe(
      (result) => {
        console.log(result);
        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire('Saved!', '', 'success');
            setTimeout(() => {
          
              location.reload();
            
            }, 2500);
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info');
          }
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="#">Why do I have this issue?</a>',
        });
      }
    )
  }


  eliminarGrupo(id:number) {

    Swal.fire({
      title: "Delete this group?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.gruposService.deleteGrupo(id.toString()).subscribe(
          (res) => {
            
           console.log(res);
           setTimeout(() => {
        
            location.reload();
          
          }, 2500);
          Swal.fire({
            title: "Done!",
            text: "The group has been deleted successfully",
            icon: "success"
          });
         
          },
    
          (err) => {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${err.error.msg}`,
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
        )
    
        
        
        
      }

     
    });
  
  }

  obtenerNombreMaestro(idMaestro: number): string {
    // Encuentra la clase correspondiente al id_grupo
    //const clase = this.arrayClases[0].find((c: {id_grupo:number})=> c.id_grupo === idGrupo);

    // Si se encuentra la clase, encuentra el maestro correspondiente al id_maestro
    
      const maestro = this.arrayMaestros[0].find((m: {id_user:number}) => m.id_user === idMaestro);
      return maestro ? `${maestro.first_nameU} ${maestro.last_nameU}` : 'Maestro no encontrado';
    

    
  }

  obtenerNombreMaestro2(idMaestro: number): string {
    // Encuentra la clase correspondiente al id_grupo
    //const clase = this.arrayClases[0].find((c: {id_grupo:number})=> c.id_grupo === idGrupo);

    // Si se encuentra la clase, encuentra el maestro correspondiente al id_maestro
    
      const maestro = this.arrayMaestros[0].find((m: {id_user:number}) => m.id_user === idMaestro);
      return maestro ? `${maestro.first_nameU} ${maestro.last_nameU}` : 'Maestro no encontrado';
    

    
  }

  
}
