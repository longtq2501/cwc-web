<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PointTransaction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'citizen_id',
        'report_id',
        'rule_id',
        'points',
        'balance_after',
        'description',
        'created_at',
    ];
}
