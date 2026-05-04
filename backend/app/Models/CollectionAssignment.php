<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollectionAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'enterprise_id',
        'collector_id',
        'status',
        'accepted_at',
        'assigned_at',
        'started_at',
        'collected_at',
        'actual_weight_kg',
        'collector_note',
        'proof_image_url',
        'failed_reason',
    ];

    protected function casts(): array
    {
        return [
            'accepted_at' => 'datetime',
            'assigned_at' => 'datetime',
            'started_at' => 'datetime',
            'collected_at' => 'datetime',
            'actual_weight_kg' => 'float',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class, 'report_id');
    }

    public function enterprise(): BelongsTo
    {
        return $this->belongsTo(RecyclingEnterprise::class, 'enterprise_id');
    }

    public function collector(): BelongsTo
    {
        return $this->belongsTo(Collector::class, 'collector_id');
    }
}
