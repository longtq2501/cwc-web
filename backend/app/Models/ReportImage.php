<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportImage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'report_id',
        'image_url',
        'is_primary',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'uploaded_at' => 'datetime',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class, 'report_id');
    }
}
