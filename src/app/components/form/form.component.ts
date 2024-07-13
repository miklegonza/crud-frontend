import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Person } from '../../models/person';
import { FormService } from '../../services/form/form.service';
import { PersonService } from '../../services/person/person.service';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class FormComponent {
    private numberPattern = /^[0-9]+$/;
    private emailPattern: RegExp =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    title: string = '';
    id: number | undefined = 0;
    button: string = '';
    formPerson: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private _api: PersonService,
        private _formService: FormService,
    ) {
        this.formPerson = this.formBuilder.group({
            name: ['', Validators.required],
            identificationNumber: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(11),
                    Validators.pattern(this.numberPattern),
                ],
            ],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.pattern(this.numberPattern),
                ],
            ],
            email: [
                '',
                [Validators.required, Validators.pattern(this.emailPattern)],
            ],
            birthdate: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.getData();
        if (this.title === 'Modificar persona' && this.id) {
            this.button = 'Modificar';
            this.feedForm(this.id);
        } else {
            this.button = 'Crear';
        }
    }

    feedForm(id: number) {
        this._api.getPersonById(id).subscribe((data: any) => {
            this.formPerson.setValue({
                name: data.name,
                identificationNumber: data.identificationNumber,
                phone: data.phone,
                email: data.email,
                birthdate: data.birthdate,
            });
        });
    }

    getData() {
        this._formService.getData.subscribe(
            ({ title, id }: { title: string; id: number }) => {
                this.title = title;
                this.id = id;
            },
        );
    }

    onSubmit() {
        if (this.formPerson.invalid) {
            Swal.fire({
                title: 'ERROR',
                text: 'Hay algunos campos del formulario inválidos',
                icon: 'error',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#d33',
            });
            return;
        }

        const person: Person = {
            name: this.formPerson.get('name')?.value,
            identificationNumber: this.formPerson.get('identificationNumber')
                ?.value,
            phone: this.formPerson.get('phone')?.value,
            email: this.formPerson.get('email')?.value,
            birthdate: this.formPerson.get('birthdate')?.value,
        };

        if (this.title === 'Crear persona') {
            this.createPerson(person);
        } else {
            this.updatePerson(person);
        }
    }

    private createPerson(person: Person) {
        this._api.createPerson(person).subscribe((data) => {
                this.formPerson.reset();
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Persona creada satisfactoriamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            });
    }

    private updatePerson(person: Person) {
        this._api.updatePerson(person, this.id).subscribe((data) => {
            this.formPerson.reset();
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Persona actualizada satisfactoriamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 2000);
        });
    }
}
