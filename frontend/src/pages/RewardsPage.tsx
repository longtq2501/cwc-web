import React from 'react';
import { 
  Award, Trophy, TrendingUp, History, 
  ArrowUpRight, Star, Leaf, Recycle, BatteryWarning,
  User, MapPin, ChevronRight
} from 'lucide-react';

const PointTransaction = ({ type, points, date, reason }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {points > 0 ? <Award className="w-5 h-5" /> : <History className="w-5 h-5" />}
      </div>
      <div>
        <p className="font-bold text-gray-900">{reason}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
    <span className={`font-bold ${points > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {points > 0 ? `+${points}` : points} đ
    </span>
  </div>
);

const LeaderboardItem = ({ rank, name, points, ward, isMe }: any) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
    isMe ? 'bg-primary-pale border-2 border-primary shadow-sm' : 'bg-white border border-gray-100'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
        rank === 2 ? 'bg-gray-100 text-gray-600' : 
        rank === 3 ? 'bg-amber-100 text-amber-700' : 'text-gray-400'
      }`}>
        {rank}
      </div>
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
        <User className="w-6 h-6" />
      </div>
      <div>
        <p className="font-bold text-gray-900 flex items-center gap-2">
          {name} {isMe && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase">Bạn</span>}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {ward}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-primary">{points.toLocaleString()} đ</p>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">EcoPoints</p>
    </div>
  </div>
);

const RewardsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Điểm thưởng & Xếp hạng</h1>
          <p className="text-gray-500">Tích lũy EcoPoint từ hành động xanh để nhận các phần quà giá trị.</p>
        </div>
        <button className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-mid transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2">
          Đổi quà ngay <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Points Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-primary to-primary-mid p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Recycle className="w-48 h-48" />
            </div>
            <p className="text-primary-pale text-sm font-medium mb-1">Số dư hiện tại</p>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-5xl font-display font-bold">1,240</h2>
              <span className="text-xl font-bold opacity-80">EcoPoint</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Tương đương</span>
                <span className="font-bold">62,000đ</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full"></div>
              </div>
              <p className="text-xs opacity-70">Sắp đạt mốc đổi thẻ cào 100,000đ</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Cách nhận thêm điểm
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Leaf className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Báo cáo hợp lệ</p>
                  <p className="text-xs text-gray-500">+10 điểm</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Recycle className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Phân loại đúng</p>
                  <p className="text-xs text-gray-500">+5 điểm</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg text-red-600"><BatteryWarning className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Rác nguy hại</p>
                  <p className="text-xs text-gray-500">+15 điểm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-gray-400" /> Lịch sử điểm
            </h3>
            <button className="text-primary text-xs font-bold">Xem tất cả</button>
          </div>
          <div className="space-y-3">
            <PointTransaction reason="Báo cáo #WR-001 thành công" points={10} date="24/05/2025" />
            <PointTransaction reason="Thưởng phân loại rác tái chế" points={5} date="24/05/2025" />
            <PointTransaction reason="Báo cáo rác nguy hại" points={15} date="22/05/2025" />
            <PointTransaction reason="Đổi thẻ cào 20k" points={-400} date="15/05/2025" />
            <PointTransaction reason="Điểm danh hàng ngày" points={2} date="14/05/2025" />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Bảng xếp hạng Phường
            </h3>
            <div className="flex gap-1">
              <span className="bg-primary-pale text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">THÁNG 5</span>
            </div>
          </div>
          <div className="space-y-3">
            <LeaderboardItem rank={1} name="Nguyễn Thị Mai" points={2450} ward="Phường 7" />
            <LeaderboardItem rank={2} name="Trần Minh Khoa" points={2100} ward="Phường 7" />
            <LeaderboardItem rank={3} name="Lê Văn Thanh" points={1890} ward="Phường 7" />
            <LeaderboardItem rank={4} name="Phạm Minh Tuấn" points={1240} ward="Phường 7" isMe />
            <LeaderboardItem rank={5} name="Hoàng Thùy Linh" points={980} ward="Phường 7" />
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl border-2 border-gray-50 text-gray-400 font-bold text-sm hover:border-primary-pale hover:text-primary transition-all flex items-center justify-center gap-2">
            Xem toàn bộ bảng xếp hạng <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
