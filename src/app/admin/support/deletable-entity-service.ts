import {EventEmitter, Injectable, OnInit} from "@angular/core";
import {map, Observable} from "rxjs";
import {DeletableDTO} from "../repository/dto/base_dto";

@Injectable({providedIn: 'root'})
export class DeletableEntityService<T extends DeletableDTO> implements OnInit {
  entityList$!: Observable<Array<T>>;
  datasource$!: Observable<Array<T>>;

  onDelete: EventEmitter<T> = new EventEmitter();
  onRestore: EventEmitter<T> = new EventEmitter();

  ngOnInit() {
    this.datasource$ = this.entityList$.pipe(map(list => list.filter(entity => !entity.deleted)))
  }

  protected changeShowDeleted(event: any) {
    this.datasource$ = this.entityList$.pipe(
      map(list => list.filter(entity => event.checked ? true : !entity.deleted))
    )
  }

  protected changeDeletedStatus(entity: T) {
    if (entity.deleted) this.onRestore.emit(entity)
    else this.onDelete.emit(entity)
  }
}
