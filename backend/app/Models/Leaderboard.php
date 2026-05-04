<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leaderboard extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'citizen_id',
        'ward_id',
        'total_points',
        'total_rank',
        'period_year',
        'period_month',
        'period_points',
        'period_rank',
        'total_reports',
        'updated_at',
    ];
}
