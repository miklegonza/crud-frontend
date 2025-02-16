import { DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Person } from '../../models/person';
import { FormService } from '../../services/form/form.service';
import { PersonService } from '../../services/person/person.service';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [DatePipe, RouterLink, NgClass],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
})
export class TableComponent {
    title: string = '';
    id: number | undefined = 0;
    persons: Person[] = [];
    tableRows: { row: string; asc: boolean }[] = [
        { row: 'name', asc: false },
        { row: 'identificationNumber', asc: false },
        { row: 'phone', asc: false },
        { row: 'email', asc: false },
        { row: 'birthdate', asc: false },
    ];

    constructor(
        private _api: PersonService,
        private _formService: FormService,
    ) {}

    ngOnInit() {
        this.getTitle();
        this.getPersons();
    }

    getTitle() {
        this._formService.getData.subscribe(
            ({ title, id }: { title: string; id: number }) => {
                this.title = title;
                this.id = id;
            },
        );
    }

    getPersons() {
        this._api.getPersons().subscribe((data: any) => {
            this.persons = data;
        });
    }

    setFormData(title: string, id?: number) {
        this._formService.setData(title, id);
    }

    deletePerson(name: string, id?: number) {
        Swal.fire({
            title: '¿Eliminar?',
            text: 'No es posible revertir este cambio',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--bs-primary)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
        }).then((result) => {
            if (result.isConfirmed) {
                this._api.deletePerson(id).subscribe(() => {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: `${name} eliminado satisfactoriamente`,
                        icon: 'success',
                        timer: 2500,
                        showConfirmButton: false,
                    });
                    this.persons.splice(
                        this.persons.findIndex((person) => person.id === id),
                        1,
                    );
                });
            }
        });
    }

    filter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (!value) {
            this.getPersons();
            return;
        }
        this.persons = this.persons.filter((person) => {
            return Object.keys(person).some((key) => {
                return String(person[key])
                    .toLowerCase()
                    .includes(value.toLowerCase());
            });
        });
    }

    sort(column: string) {
        const row = this.tableRows.find((tableRow) => tableRow.row === column);
        if (!row) return;
        row.asc = !row.asc;

        this.persons.sort((a, b) => {
            const valueA = String(a[column]).toLowerCase();
            const valueB = String(b[column]).toLowerCase();
            if (row.asc) {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }
}
