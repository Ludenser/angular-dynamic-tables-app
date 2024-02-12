import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { keys, omit, reduce } from 'ramda';
import { DataSets } from '../../../services/api/data.models';
interface FormControls {
  [key: string]: { value: string, disabled?: boolean }[];
}

interface ModalData {
  row?: DataSets;
  mode: 'edit' | 'add';
  defaultStructure?: DataSets;
}

@Component({
  selector: 'showcase-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzTypographyModule, NzIconModule],
})
export class DynamicFormComponent implements OnInit {
  editForm!: FormGroup;
  row: DataSets = {} as DataSets;
  objectKeys = Object.keys;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: ModalData) { }

  ngOnInit(): void {
    this.row = this.data.row || {} as DataSets;
    this.initForm();
  }

  initForm(): void {
    const structureSource = this.data.mode === 'add'
      ? this.getDefaultStructure()
      : omit(['checked'], this.row);

    const formControls = reduce((acc: FormControls, key: string) => {
      const initialValue = ((structureSource as { [key: string]: any })[key]) || '';
      const validators = [Validators.required];
      if (key === 'id') {
        acc[key] = [{ value: initialValue, disabled: true }];
      } else {
        acc[key] = [initialValue, validators];
      }

      return acc;
    }, {} as FormControls, keys(structureSource));

    this.editForm = this.fb.group(formControls);
  }

  getDefaultStructure(): DataSets {
    return this.data.defaultStructure || {} as DataSets
  }


  onSubmit(): void {
    if (this.editForm.valid) {
      const resultData = this.data.mode === 'edit' ? this.editForm.value : { ...this.editForm.value, id: '' };
      this.modalRef.close(resultData);
    }
  }
}
