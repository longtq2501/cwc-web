<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteType extends Model
{
    use HasFactory;

    protected $table = 'waste_types';

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'points_per_kg',
        'icon_url',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'points_per_kg' => 'integer',
        ];
    }
}
