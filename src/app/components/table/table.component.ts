import { Component } from '@angular/core';
import { PersonService } from '../../services/person/person.service';

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
})
export class TableComponent {
    constructor(private _api: PersonService){
        
    }
}
