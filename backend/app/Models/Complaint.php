<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'request_id',
        'assignment_id',
        'complaint_type',
        'content',
        'status',
        'resolved_by',
        'resolved_at',
        'resolution_note',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'is_deleted' => 'boolean',
        ];
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(WasteRequest::class, 'request_id');
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(CollectionAssignment::class, 'assignment_id');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
