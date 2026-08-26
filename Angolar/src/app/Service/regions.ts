import { Injectable } from '@angular/core';

export type Area = {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class Regions {
  private Areas: Area[] = [
    {
      id: 1,
      name: "רמת הגולן ועמק החולה"
    },
    {
      id: 2,
      name: "גליל עליון"
    },
    {
      id: 3,
      name: "גליל תחתון ועמקים"
    },
    {
      id: 4,
      name: "כרמל ורמות מנשה"
    },
    {
      id: 5,
      name: "מישור החוף והשרון"
    },
    {
      id: 6,
      name: "הרי שומרון, הרי יהודה ושפלת יהודה"
    },
    {
      id: 7,
      name: "ירושלים"
    },
    {
      id: 8,
      name: "מדבר יהודה וים המלח"
    },
    {
      id: 9,
      name: "הנגב"
    },
    {
      id: 10,
      name: "אילת והערבה"
    }

  ]

   getAllAreas(): Area[] {
    return this.Areas;
  }

  //פונ' שממירה את ה-ID לשמות של האיזורים
  getAreasById(areaId: number): string {
    return this.Areas.find((r) => r.id === areaId)?.name || 'כללי';
  }
}
