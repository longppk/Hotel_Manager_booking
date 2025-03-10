import { ReactNode } from "react";

export interface Product {
  id: number;
  image: string;
  description: string;
  detail: string;
  name: string;
  rating: number;
  price: number;
  quantitySold: number;
  remainingQuantity: number;
  category: string;
  date: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  content: string;
  rating: number;
  updated: [number, number, number, number, number, number, number];
  avatar: string;
}

export interface RoomData {
  data: Room[];
}

export interface MeetingData {
  code: number;
  data: {
    sessionId: string;
    start: string;
    end: string | null;
    meetingId: string;
    duration: number;
    links: {
      get_room: string;
      get_session: string;
    };
    playbackHlsUrl: string;
    id: string;
  };
}

export interface Room {
  roomId: string;
  customRoomId: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    discontinuedReason: string | null;
    id: string;
  };
  id: string;
  links: {
    get_room: string;
    get_session: string;
  };
}

export interface RoomDetail {
  id: number;
  name: string;
  capacity: number;
  price: number;
  description: string;
  roomAvailableStatus: RoomAvailableStatus;
  dateExpired: Date
  roomType: string;
}

// Room interface representing the structure of a Room object
export interface RoomHotel {
  id: number; // Phòng có id kiểu số
  capacity: number; // Sức chứa của phòng
  price: number; // Giá của phòng
  description: string; // Mô tả phòng
  roomAvailableStatus: RoomAvailableStatus; // Trạng thái phòng (Có sẵn hay không)
  roomTypeName: string; // Tên loại phòng (ví dụ: Deluxe, Standard)
  amenities: string[]; // Danh sách tiện nghi trong phòng
  roomImages: RoomImage[];
  roomType: RoomType;
  name: string;
}

export interface RoomImage {
  url: string;
}

// Enum representing the status of a room (available or not)
export enum RoomAvailableStatus {
  SELECTED = "SELECTED", // phòng đang chọn
  AVAILABLE = "AVAILABLE", // Phòng sẵn sàng để đặt
  RESERVED = "RESERVED", // Phòng đã được đặt trước
  OCCUPIED = "OCCUPIED", // Phòng đang có khách ở
  CHECKED_OUT = "CHECKED_OUT", // Phòng đã trả nhưng chưa dọn dẹp
  UNDER_CLEANING = "UNDER_CLEANING", // Phòng đang được dọn dẹp
  OUT_OF_ORDER = "OUT_OF_ORDER", // Phòng không khả dụng (sự cố)
  UNDER_MAINTENANCE = "UNDER_MAINTENANCE", // Phòng đang sửa chữa/nâng cấp
  BLOCKED = "BLOCKED", // Phòng bị chặn sử dụng tạm thời
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION", // Đang chờ xác nhận đặt phòng
  NO_SHOW = "NO_SHOW", // Khách không đến (đặt mà không nhận phòng)
  HOLD = "HOLD", // Phòng giữ tạm thời
  CANCELLED = "CANCELLED", // Đặt phòng bị hủy
  VIP_READY = "VIP_READY", // Phòng chuẩn bị cho khách VIP
}

export interface RoomFilter {
  capacity?: number; // Sức chứa phòng, có thể không cần nếu không lọc theo
  minPrice?: number; // Giá tối thiểu
  maxPrice?: number; // Giá tối đa
  roomAvailableStatus?: RoomAvailableStatus; // Trạng thái phòng (Sử dụng enum RoomAvailableStatus)
  roomTypeName?: string; // Tên loại phòng (ví dụ: Deluxe, Standard)
  amenities?: string[]; // Danh sách tiện nghi trong phòng
  createdAtAfter?: string; // Thời gian tạo phòng sau (ISO String)
  updatedAtBefore?: string; // Thời gian cập nhật phòng trước (ISO String)
  checkInDate?: string;
  checkOutDate?: string;
  page?: number; // Trang hiện tại
  size?: number; // Kích thước trang
  sort?: string[]
}

export interface Pagination {
  page: number; // Số trang hiện tại
  pageSize: number; // Số lượng mục trên mỗi trang
  totalItems: number; // Tổng số mục
  totalPages: number; // Tổng số trang
}

export interface PaginatedResponse<T> {
  data: T[]; // Danh sách dữ liệu trên trang
  pagination: Pagination; // Thông tin phân trang
}

export interface Meta {
  createdAt: string;
  width: number;
  height: number;
  format: string;
}

export interface ThumbnailResponse {
  message: string;
  roomId: string;
  meta: Meta;
  filePath: string;
  fileSize: number;
  fileName: string;
}

export interface ChatHistory {
  role: string;
  content: string;
}

export interface CartInfo {
  cartDetailEntities: number[];
  userId: number;
  paymentMethod: string;
  amenityEntities: number[];
}

export interface Login {
  email: string;
  password: string;
}

export interface CartItem {
  id?: number;
  productId?: number;
  quantity: number;
}

export interface CartRequestDto {
  userId: number;
  roomId?: number;
  quantity: number;
  checkIn: Date;
  checkOut: Date;
}

export interface ReviewRequestDto {
  userId: number | null;
  productId: number | null;
  content: string;
  rating: number;
}

export interface GetCartReponseDto {
  id: number;
  userId: number;
  cartDetail: CartDetail[];
}

export interface CartDetail {
  id: number;
  room: RoomHotel;
  quantity: number;
  checkIn: [number, number, number];
  checkOut: [number, number, number];
}

export interface Cart {
  id: string;
  listCartItem: Array<CartItem>;
}

export interface SignUpInfo {
  name: string;
  email: string;
  password: string;
}

export interface InputFieldProps {
  type: string;
  label: string;
  name: string;
  children: ReactNode;
}

export interface GetUserInfoDto {
  id?: number | null;
  name: string | null;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  dob?: string | null;
  avatar?: string | null;
  role: string[]
}

export interface User {
  id: string;
  name: string;
  password: string;
  gender: number | null;
  dob:  [number, number, number] | null;
  email: string;
  address: string | null;
  phone: string | null;
  isActive: string | null;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  price: number;
}

export interface RoomType {
  id: string;
  name: string;
}

export interface Bill {
  billCode: string;
  userName: string;
  total: number
  createdAt: string;
}

export interface ChiTietSanPhamRequest {
  idChiTietSanPham: string;
  idMauSac?: string;
  idKichCo?: string;
  tenKichCo?: string;
  tenMauSac?: string;
  maMau?: string;
  soLuong?: number;
  giaBan?: number;
  urlAnh?: string;
}

export interface ChiTietSanPhamUpdateRequest {
  idSanPham: string;
  ma?: string;
  chiTietSanPhams: ChiTietSanPhamRequest[];
  trangThai?: string;
  location?: number;
  mauSacs?: MauSac[];
}

export interface MauSac {
  id: string;
  ten: string;
  ma: string;
  trangThai: number;
  chiTietSanPhams: any | null;
  anhs: any | null;
}

export interface Room {
  id: string;
  ten: string;
  ma: string;
  anh: string;
  giaBan: number;
  giaGoc: number;
  soLuong: number;
  chatLieu: string;
  loaiSPCha: string;
  loaiSPCon: string;
  trangThai: number;
  idKhuyenMai: string | null;
  mota: string | null;
}

export interface ChatLieu {
  id: string;
  ten: string;
  trangThai: number;
  sanPhams: any | null;
}

export interface LoaiSP {
  id: string;
  ten: string;
  trangThai: number;
  idLoaiSPCha: string | null;
  sanPhams: any | null;
  loaiSPCha: LoaiSP | null;
}

export interface KichCo {
  id: string;
  ten: string;
  trangThai: number;
  chiTietSanPhams: any | null;
}

export interface StatisticData {
  roomsAvailable: number;
  guestsStaying: number;
  revenue: number;
}

export interface Booking {
  id: string;
  room: string;
  guest: string;
  date: string;
  status: string;
}

export type Month =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export interface Order {
  id: number;
  createdAt: Date;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  user: User;
}