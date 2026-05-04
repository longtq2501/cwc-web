<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collector extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'enterprise_id',
        'vehicle_info',
        'status',
        'joined_at',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'date',
            'is_deleted' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(RecyclingEnterprise::class, 'enterprise_id');
    }
}
