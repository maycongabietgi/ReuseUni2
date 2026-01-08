import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../components/Header/Header"; // Adjust path

type EditAddressNavProp = NativeStackNavigationProp<RootStackParamList, "EditAddress">;
type EditAddressRouteProp = RouteProp<RootStackParamList, "EditAddress">;

type Props = {
  navigation: EditAddressNavProp;
  route: EditAddressRouteProp;
};

interface Profile {
  name: string;
  phone?: string; // Optional vì backend hiện chưa có
  address: string;
  // Thêm field khác nếu cần
}

export default function EditAddressScreen({ navigation, route }: Props) {
  const { token: authToken } = useAuth();

  const oldAddress = route.params?.address;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isPrimary, setIsPrimary] = useState(oldAddress?.isPrimary || false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch profile để lấy hint name + phone + address
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập");
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch("https://bkapp-mp8l.onrender.com/api/me/", {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) throw new Error("Không thể tải thông tin cá nhân");

        const data = await response.json();
        setProfile(data);

        // Hint phone (nếu backend có field phone sau này)
        if (data.phone) setPhone(data.phone);

        // Phân tách address nếu cần (ví dụ: "123 Đường Thủ Thiêm, Quận 1, TP. HCM")
        if (data.address) {
          const parts = data.address.split(", ").reverse(); // Reverse để lấy city trước
          setCity(parts[0] || "");
          setDistrict(parts[1] || "");
          setWard(parts[2] || "");
          setAddressDetail(parts.slice(3).reverse().join(", ") || ""); // Phần còn lại là detail
        }
      } catch (error) {
        console.error("Lỗi fetch profile:", error);
        Alert.alert("Lỗi", "Không tải được thông tin. Một số field có thể trống.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const fullAddress = `${addressDetail ? addressDetail + ", " : ""}${ward ? ward + ", " : ""}${district ? district + ", " : ""}${city || ""}`.trim();

  const handleSubmit = async () => {
    if (!phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    if (!fullAddress) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ địa chỉ");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch("https://bkapp-mp8l.onrender.com/api/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify({
          phone: phone.trim(),
          address: fullAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.phone?.[0] ||
          errorData.address?.[0] ||
          errorData.detail ||
          "Cập nhật thất bại"
        );
      }

      Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D7FF9" />
        <Text>Đang tải thông tin cá nhân...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {route.params?.address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      </Text>

      {/* Full Name - Khóa, hint từ profile */}
      <Text style={styles.label}>Họ và tên</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={profile?.name || "Chưa có tên"}
        editable={false}
      />

      {/* Phone - Có thể hint nếu backend trả về */}
      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder={profile?.phone ? profile.phone : "Ví dụ: 0909123456"}
      />

      {/* Các field còn lại */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Tỉnh / Thành phố</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Quận / Huyện</Text>
          <TextInput style={styles.input} value={district} onChangeText={setDistrict} />
        </View>
      </View>

      <Text style={styles.label}>Phường / Xã</Text>
      <TextInput style={styles.input} value={ward} onChangeText={setWard} />

      <Text style={styles.label}>Địa chỉ chi tiết</Text>
      <TextInput style={styles.input} value={addressDetail} onChangeText={setAddressDetail} />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Đặt làm địa chỉ mặc định</Text>
        <Switch value={isPrimary} onValueChange={setIsPrimary} />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  disabledInput: {
    backgroundColor: "#EDEDED",
    color: "#666",
  },
  row: {
    flexDirection: "row",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2D7FF9",
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});