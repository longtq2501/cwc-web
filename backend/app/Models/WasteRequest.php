<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WasteRequest extends Model
{
    use HasFactory;

    protected $table = 'waste_requests';

    protected $fillable = [
        'citizen_id',
        'waste_type_id',
        'ward_id',
        'address_detail',
        'latitude',
        'longitude',
        'description',
        'estimated_weight_kg',
        'status',
        'rejected_reason',
        'is_valid_report',
        'is_correct_type',
        'points_awarded',
        'ai_suggested_type',
        'ai_confidence',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'estimated_weight_kg' => 'float',
            'ai_confidence' => 'float',
            'is_valid_report' => 'boolean',
            'is_correct_type' => 'boolean',
            'is_deleted' => 'boolean',
        ];
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(RequestImage::class, 'request_id');
    }
}
