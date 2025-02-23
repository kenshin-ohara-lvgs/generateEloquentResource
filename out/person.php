<?php

namespace LvgsLaravelLvmModelsResourcesEloquent;

class MarketingKoCareerlibPerson extends BaseEloquent
{
  protected $table = 'marketing_ko_careerlib_person';

  protected $primaryKey = 'undefined';

  protected $with = [
      'member',
      'labors',
  ];

  protected $fillable = [
  ];

  protected $visible_column = [
    'id',
    'experience_year',
    'nick_name',
    'age_type_id',
    'sex_id',
    'created_at',
    'updated_at',
    'deleted_at'
  ];
    public function marketing_ko_careerlib_person_age_type()
    {
        return $this->belongsTo(MarketingKoCareerlibPersonAgeType::class, 'age_type_id', 'id');
    }

    public function sex()
    {
        return $this->belongsTo(Sex::class, 'sex_id', 'id');
    }
}
