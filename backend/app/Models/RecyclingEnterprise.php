<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecyclingEnterprise extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'enterprise_name',
        'license_number',
        'description',
        'address',
        'ward_id',
        'logo_url',
        'status',
        'approved_at',
        'approved_by',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'is_deleted' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collectors(): HasMany
    {
        return $this->hasMany(Collector::class, 'enterprise_id');
    }
}
