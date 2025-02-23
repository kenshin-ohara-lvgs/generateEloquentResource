<?php

namespace LvgsLaravelLvmModelsResourcesEloquent;

class MarketingKoCareerlibPersonAgeType extends BaseEloquent
{
  protected $table = 'marketing_ko_careerlib_person_age_type';

  protected $primaryKey = 'undefined';

  protected $with = [
      'member',
      'labors',
  ];

  protected $fillable = [
  ];

  protected $visible_column = [
    'id',
    'name',
    'created_at',
    'updated_at',
    'deleted_at'
  ];
    public function marketing_ko_careerlib_persons()
    {
        return $this->hasMany(MarketingKoCareerlibPerson::class, 'age_type_id', 'id');
    }
}
