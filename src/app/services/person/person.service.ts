import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Person } from '../../models/person';

@Injectable({
    providedIn: 'root',
})
export class PersonService {
    private apiUrl = `${environment.apiUrl}/persons`;

    constructor(private http: HttpClient) {}

    getPersons() {
        return this.http.get(this.apiUrl);
    }

    getPersonById(id?: number) {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    createPerson(person: Person) {
        return this.http.post(this.apiUrl, person);
    }

    updatePerson(person: Person, id?: number) {
        return this.http.put(`${this.apiUrl}/${id}`, person);
    }

    deletePerson(id?: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
