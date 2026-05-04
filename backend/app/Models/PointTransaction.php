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
        'request_id',
        'rule_id',
        'points',
        'balance_after',
        'description',
        'created_at',
    ];

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function request()
    {
        return $this->belongsTo(WasteRequest::class, 'request_id');
    }

    public function rule()
    {
        return $this->belongsTo(PointRule::class, 'rule_id');
    }
}
