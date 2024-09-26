import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
    UpdateDateColumn, ManyToMany , JoinTable
 } from "typeorm";
 import { Curso } from "./cursoModel";

@Entity('estudiantes') //entidad mapeada a la tabla estudiantes
export class Estudiante{ //exporta la clase con atributos de la tabla estudiantes
    @PrimaryGeneratedColumn() //decorador. Funcion especial para definir
    id: number;  //las entidades. Este es para que sea clave primaria y
                     //autoincremental
    @Column()
    dni:string;

    @Column() //marca que el campo nombre se almacenará como columna
    nombre:string; //en base de datos

    @Column()
    apellido:string;

    @Column()
    email:string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt:Date;

    @ManyToMany(() => Curso)
    @JoinTable({
       name: 'cursos_estudiantes',
       joinColumn:{ name: 'estudiante_id', referencedColumnName: 'id'},
       inverseJoinColumn:  {name:'curso_id', referencedColumnName: 'id'}
    })
    cursos: Curso[];
}