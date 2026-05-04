<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointRulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = DB::table('users')->where('email', 'admin@ecocollect.vn')->value('id');
        $hazardousTypeId = DB::table('waste_types')->where('name', 'Hazardous')->value('id');

        $rows = [
            [
                'waste_type_id' => null,
                'rule_name' => 'Bao cao hop le',
                'condition_type' => 'valid_report',
                'points' => 10,
                'is_active' => true,
                'effective_from' => '2025-01-01',
                'effective_to' => null,
                'created_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'waste_type_id' => null,
                'rule_name' => 'Phan loai rac dung',
                'condition_type' => 'correct_classification',
                'points' => 5,
                'is_active' => true,
                'effective_from' => '2025-01-01',
                'effective_to' => null,
                'created_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'waste_type_id' => $hazardousTypeId,
                'rule_name' => 'Bao cao rac nguy hai dung',
                'condition_type' => 'correct_classification',
                'points' => 15,
                'is_active' => true,
                'effective_from' => '2025-01-01',
                'effective_to' => null,
                'created_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'waste_type_id' => null,
                'rule_name' => 'Bao cao dau tien trong ngay',
                'condition_type' => 'first_report_of_day',
                'points' => 3,
                'is_active' => true,
                'effective_from' => '2025-01-01',
                'effective_to' => null,
                'created_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($rows as $row) {
            DB::table('point_rules')->updateOrInsert(
                ['rule_name' => $row['rule_name']],
                $row
            );
        }
    }
}
