// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";

// const orders = [
//   {
//     id: "#12345",
//     date: "2025-02-08",
//     total: "$150.00",
//     status: "Đang xử lý",
//   },
//   {
//     id: "#12346",
//     date: "2025-02-07",
//     total: "$200.00",
//     status: "Hoàn thành",
//   },
//   {
//     id: "#12347",
//     date: "2025-02-06",
//     total: "$50.00",
//     status: "Đã hủy",
//   },
// ];

// export default function OrderList() {
//   const [orderList, setOrderList] = useState(orders);

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
//       <div className="space-y-4">
//         {orderList.map((order) => (
//           <Card key={order.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
//             <CardContent>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg font-semibold">Mã đơn: {order.id}</h2>
//                   <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
//                   <p className="text-sm font-medium">Tổng tiền: {order.total}</p>
//                   <p className="text-sm font-medium">Trạng thái: {order.status}</p>
//                 </div>
//                 <Button className="text-sm">Xem chi tiết</Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
