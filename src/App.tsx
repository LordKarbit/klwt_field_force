import { Fragment, Suspense, createContext, lazy, useContext, useEffect, useMemo, useRef, useState, type ChangeEvent, type ComponentProps, type TouchEvent, type WheelEvent } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip as MuiChip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import EditLocationAltRoundedIcon from '@mui/icons-material/EditLocationAltRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import HomeRepairServiceRoundedIcon from '@mui/icons-material/HomeRepairServiceRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded';
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import SyncProblemRoundedIcon from '@mui/icons-material/SyncProblemRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import {
  api,
  type AnalyticsPayload,
  type ApiUser,
  type AssignmentItem,
  type AssignmentPayload,
  type DashboardMetricKey,
  type DashboardMetricSurveyorGroup,
  type DashboardTimeSeriesMode,
  type DashboardTimeSeriesPayload,
  type DashboardTimeSeriesPoint,
  type DashboardTimeSeriesSummary,
  type DashboardTimeSeriesSurveyorOption,
  type DuplicateCandidate,
  type ImportResult,
  type NotificationItem,
  type PushNotificationStatus,
  type PushSubscriptionPayload,
  type Role,
  type SurveyHistoryItem,
  type SurveySubmitResult,
  type VerificationDecision,
  type VerificationHistorySurveyorGroup,
  type VerificationMetricKey,
  type VerificationMetricSummary,
  type VerificationMetricSurveyorGroup,
} from './api';
import {
  DUPLICATE_WARNING_THRESHOLD,
  coordinateDistanceMeters,
  duplicateCandidateScore,
  duplicateMatchDetails,
  type DuplicateMatchDetails,
  type DuplicateMatchKey,
} from './verificationLogic';
import { importTemplates, type ImportTemplateKey } from './importTemplates';
import logoUrl from '../logo.svg';

const GpsMapPreview = lazy(() => import('./components/GpsMapPreview'));

type ViewKey = 'command' | 'assignments' | 'surveyor' | 'survey-detail' | 'verification' | 'intelligence' | 'admin' | 'users';
type AppUser = ApiUser & { password?: string };
type AppLanguage = 'id' | 'en' | 'zh';
type SurveyHint = Record<AppLanguage, string>;

const defaultLanguage: AppLanguage = 'id';
const LanguageContext = createContext<AppLanguage>(defaultLanguage);

function useCurrentLanguage() {
  return useContext(LanguageContext);
}

type SmartChipProps = ComponentProps<typeof MuiChip> & {
  tooltip?: React.ReactNode;
  reason?: string;
};

function localCopy(language: AppLanguage, copy: Record<AppLanguage, string>) {
  return copy[language];
}

function labelNodeToText(label: SmartChipProps['label']): string {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  if (Array.isArray(label)) return label.map(labelNodeToText).filter(Boolean).join(' ');
  return '';
}

function chipMeaning(labelText: string, color: SmartChipProps['color'], language: AppLanguage) {
  if (/(hot lead|hot\b)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Toko ini layak diprioritaskan untuk follow-up penjualan.',
      en: 'This store should be prioritized for sales follow-up.',
      zh: '该门店应优先安排销售跟进。',
    });
  }
  if (/(strategis|strategic)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Kategori cooling toko ini kuat, tetapi belum menjadi prioritas Hot Lead.',
      en: 'This store has strong cooling-category signals, but is not yet a Hot Lead.',
      zh: '该门店的冷却品类信号较强，但尚未达到高意向线索。',
    });
  }
  if (/(qualified)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Toko ini memenuhi syarat masuk pipeline lead, tetapi masih perlu follow-up lanjutan.',
      en: 'This store qualifies for the lead pipeline, but still needs follow-up.',
      zh: '该门店符合进入线索池的条件，但仍需要进一步跟进。',
    });
  }
  if (/(normal lead|lead normal)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Toko masih relevan untuk dipantau, tetapi sinyal prioritasnya belum kuat.',
      en: 'The store is still worth monitoring, but its priority signals are not strong yet.',
      zh: '该门店仍值得关注，但优先级信号尚不强。',
    });
  }
  if (/(low priority|prioritas rendah)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Potensi toko masih rendah dibanding kandidat lain pada scope ini.',
      en: 'The store has lower potential than other candidates in this scope.',
      zh: '与当前范围内其他候选门店相比，该门店潜力较低。',
    });
  }
  if (/(warning|peringatan|perlu perhatian|gps|foto belum lengkap|missing)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Ada sinyal yang perlu dicek sebelum data diputuskan.',
      en: 'There is a signal that should be checked before a decision is made.',
      zh: '在做出决定前，有信号需要先复核。',
    });
  }
  if (/(valid|terverifikasi|verified|ready|siap|success)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Data sudah memenuhi kriteria operasional dan bisa dipakai.',
      en: 'The data meets operational criteria and can be used.',
      zh: '数据已符合运营标准，可以使用。',
    });
  }
  if (/(revisi|revision)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Data perlu diperbaiki oleh surveyor sebelum bisa disetujui.',
      en: 'The data needs correction by the surveyor before it can be approved.',
      zh: '数据需要调研员修正后才能批准。',
    });
  }
  if (/(reject|tolak|invalid|ditolak)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Data tidak cukup layak untuk menjadi master store.',
      en: 'The data is not reliable enough to become a master store record.',
      zh: '该数据不足以作为主门店记录。',
    });
  }
  if (/(duplicate|duplikat|merge|gabung)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Data memiliki indikasi mirip dengan toko yang sudah ada.',
      en: 'The data appears similar to an existing store record.',
      zh: '该数据与已有门店记录存在相似信号。',
    });
  }
  if (/(avg dq|dq|quality|kualitas|baik|critical|kritis|poor|buruk)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Ringkasan kualitas data berdasarkan kelengkapan survey, GPS, kontak, dan foto.',
      en: 'A data-quality summary based on survey completeness, GPS, contact, and photos.',
      zh: '基于问卷完整性、GPS、联系人和照片的数据质量摘要。',
    });
  }
  if (/(match|cocok|kecocokan|%)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Angka ini menunjukkan tingkat kesamaan atau proporsi data pada konteks yang sedang dibuka.',
      en: 'This number shows a match level or data proportion in the current context.',
      zh: '该数值表示当前上下文中的匹配度或数据占比。',
    });
  }
  if (color === 'success') {
    return localCopy(language, {
      id: 'Statusnya baik, selesai, atau siap dipakai.',
      en: 'The status is good, completed, or ready to use.',
      zh: '状态良好、已完成或可使用。',
    });
  }
  if (color === 'warning') {
    return localCopy(language, {
      id: 'Perlu dicek dulu sebelum diproses lebih lanjut.',
      en: 'This should be checked before moving forward.',
      zh: '继续处理前需要先检查。',
    });
  }
  if (color === 'error') {
    return localCopy(language, {
      id: 'Ada risiko tinggi, penolakan, atau keputusan final yang perlu diperhatikan.',
      en: 'There is a high risk, rejection, or final decision to note.',
      zh: '存在高风险、驳回或需要注意的最终决定。',
    });
  }
  if (color === 'secondary') {
    return localCopy(language, {
      id: 'Sinyal ini punya prioritas atau potensi yang lebih menonjol.',
      en: 'This signal has stronger priority or potential.',
      zh: '该信号代表更高的优先级或潜力。',
    });
  }
  if (color === 'primary' || color === 'info') {
    return localCopy(language, {
      id: 'Informasi pendukung untuk membantu membaca baris data ini.',
      en: 'Supporting information to help read this data row.',
      zh: '用于帮助理解该行数据的辅助信息。',
    });
  }
  return localCopy(language, {
    id: 'Ringkasan singkat agar status atau atribut data lebih mudah dibaca.',
    en: 'A compact summary that makes the data status or attribute easier to read.',
    zh: '简短摘要，用于更容易阅读数据状态或属性。',
  });
}

function chipReason(labelText: string, reason: string | undefined, language: AppLanguage) {
  if (reason) return reason;
  if (/(hot lead|hot\b)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Diberikan ketika Merchant Grade A/A+, toko terbuka mencoba supplier baru, dan nomor WhatsApp tersedia. Grade berasal dari relevansi cooling, produk, aktivitas jual, potensi beli, keluhan supplier, openness, dan WA.',
      en: 'Assigned when Merchant Grade is A/A+, the store is open to a new supplier, and WhatsApp is available. The grade comes from cooling relevance, products, sales activity, purchase potential, supplier pain, openness, and WA.',
      zh: '当商户等级为 A/A+、愿意尝试新供应商且提供 WhatsApp 时标记。等级来自冷却相关性、产品、销售活跃度、采购潜力、供应商痛点、开放度和 WA。',
    });
  }
  if (/(qualified)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Muncul saat Merchant Grade A/A+ dan toko terbuka mencoba supplier baru, tetapi belum menjadi Hot Lead karena WA belum tersedia.',
      en: 'Shown when Merchant Grade is A/A+ and the store is open to a new supplier, but it is not a Hot Lead because WA is not available yet.',
      zh: '当商户等级为 A/A+ 且愿意尝试新供应商，但尚未提供 WA 时显示。',
    });
  }
  if (/(strategic|strategis)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Dipakai ketika produk cooling dan aktivitas jual kuat, tetapi toko belum cukup terbuka untuk masuk Hot atau Qualified Lead.',
      en: 'Used when cooling products and sales activity are strong, but the store is not open enough to become Hot or Qualified Lead.',
      zh: '用于冷却产品和销售活跃度较强，但开放度尚不足以成为高意向或合格线索的门店。',
    });
  }
  if (/(normal lead|lead normal)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Umumnya muncul pada Merchant Grade B. Toko masih relevan, tetapi sinyal cooling, openness, atau potensi beli belum dominan.',
      en: 'Usually shown for Merchant Grade B. The store is relevant, but cooling, openness, or purchase-potential signals are not dominant yet.',
      zh: '通常对应商户等级 B。门店仍相关，但冷却品类、开放度或采购潜力信号尚不突出。',
    });
  }
  if (/(low priority|prioritas rendah)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Dipakai saat Merchant Score rendah atau sinyal utama seperti cooling, nilai pembelian, openness, dan kontak belum kuat.',
      en: 'Used when Merchant Score is low or key signals such as cooling, purchase value, openness, and contact are still weak.',
      zh: '用于商户分数较低，或冷却品类、采购金额、开放度和联系方式等关键信号仍较弱的情况。',
    });
  }
  if (/(avg dq|dq|quality|kualitas|baik|good|warning|perlu perhatian|critical|kritis|poor|buruk)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Skor mulai dari 100. Sistem mengurangi skor untuk risiko seperti GPS >100m, WA kosong, foto rak/PIC kosong, supplier atau kontak kosong, dan terlalu banyak jawaban tidak tahu.',
      en: 'The score starts at 100. The system subtracts for risks such as GPS >100m, missing WA, missing rack/PIC photos, missing supplier/contact, and too many unknown answers.',
      zh: '分数从 100 开始。系统会因 GPS 超过 100 米、WA 缺失、货架/PIC 照片缺失、供应商或联系人缺失、过多未知答案而扣分。',
    });
  }
  if (/(merchant|grade|a\+|\ba\b|\bb\b|\bc\b|\d+\s*\/\s*\d+)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Merchant Score menilai potensi bisnis dari tipe toko, produk cooling, aktivitas jual, nilai beli, restock, keluhan supplier, openness, WA, dan decision maker.',
      en: 'Merchant Score estimates business potential from store type, cooling products, sales activity, purchase value, restock, supplier pain, openness, WA, and decision maker.',
      zh: '商户分数根据门店类型、冷却产品、销售活跃度、采购金额、补货、供应商痛点、开放度、WA 和决策人估算业务潜力。',
    });
  }
  if (/(gps)/i.test(labelText)) {
    return localCopy(language, {
      id: 'GPS warning muncul bila lokasi submit lebih dari 100 meter dari target toko atau akurasi perangkat perlu diragukan.',
      en: 'GPS warning appears when the submitted location is more than 100 meters from the store target or device accuracy is questionable.',
      zh: '当提交位置距离目标门店超过 100 米，或设备精度需要复核时，会出现 GPS 预警。',
    });
  }
  if (/(foto|photo|missing)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Kelengkapan foto memengaruhi Data Quality. Foto rak atau PIC yang kosong membuat record perlu dicek verifikator.',
      en: 'Photo completeness affects Data Quality. Missing rack or PIC photos make the record require verifier review.',
      zh: '照片完整性会影响数据质量。缺少货架或 PIC 照片时，记录需要审核员复核。',
    });
  }
  if (/(wa|whatsapp)/i.test(labelText)) {
    return localCopy(language, {
      id: 'WA dipakai sebagai sinyal contactability. Jika kosong, toko tidak bisa masuk Hot Lead meski potensi bisnisnya tinggi.',
      en: 'WA is used as a contactability signal. If it is missing, the store cannot become a Hot Lead even with high business potential.',
      zh: 'WA 用作可联系性信号。若缺失，即使业务潜力高，门店也不能成为高意向线索。',
    });
  }
  if (/(duplicate|duplikat|merge|gabung)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Indikasi duplikat dihitung dari kemiripan nama toko, WA, kota, kecamatan, kelurahan, alamat, dan koordinat. Jika digabung, verifikator harus memilih master store.',
      en: 'Duplicate indication is calculated from store-name, WA, city, district, village, address, and coordinate similarity. If merged, the verifier must choose the master store.',
      zh: '重复提示来自门店名称、WA、城市、区县、村/社区、地址和坐标相似度。合并时审核员必须选择主门店。',
    });
  }
  if (/(verified|terverifikasi|valid)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Diberikan setelah verifikator menyetujui data sebagai store yang layak dipakai. Record ini masuk valid rate dan database toko terverifikasi.',
      en: 'Assigned after a verifier approves the data as a usable store record. It counts toward valid rate and the verified store database.',
      zh: '审核员确认数据可用后赋予该状态。记录会计入有效率和已验证门店库。',
    });
  }
  if (/(revision|revisi)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Dipilih saat data masih bisa diperbaiki. Revision request wajib diisi agar surveyor tahu bagian yang harus dilengkapi.',
      en: 'Selected when the data can still be corrected. A revision request is required so the surveyor knows what to complete.',
      zh: '用于数据仍可修正的情况。必须填写修订要求，让调研员知道需要补充的内容。',
    });
  }
  if (/(reject|tolak|invalid|ditolak)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Dipakai jika identitas toko, lokasi, atau evidence tidak cukup dapat dipercaya untuk disimpan sebagai master store.',
      en: 'Used when store identity, location, or evidence is not reliable enough to be saved as a master store.',
      zh: '用于门店身份、位置或证据不足以可信保存为主门店的情况。',
    });
  }
  if (/(waiting|menunggu)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Diberikan otomatis setelah survey disubmit. Jika ada warning flag, record naik ke antrean prioritas verifikator.',
      en: 'Assigned automatically after survey submission. If warning flags exist, the record moves into the verifier priority queue.',
      zh: '调研提交后自动赋予。若存在预警标记，记录会进入审核优先队列。',
    });
  }
  if (/(match|cocok|kecocokan)/i.test(labelText)) {
    return localCopy(language, {
      id: 'Skor kecocokan duplikat memakai bobot: nama toko 30%, WA 25%, kota 10%, kecamatan 10%, kelurahan 8%, alamat 12%, dan koordinat <=100m 5%.',
      en: 'Duplicate match score uses these weights: store name 30%, WA 25%, city 10%, district 10%, village 8%, address 12%, and coordinates <=100m 5%.',
      zh: '重复匹配分使用权重：门店名称 30%、WA 25%、城市 10%、区县 10%、村/社区 8%、地址 12%、坐标 <=100 米 5%。',
    });
  }
  if (/%/.test(labelText)) {
    return localCopy(language, {
      id: 'Persentase dihitung dari data backend pada scope aktif. Nilainya mengikuti jenis indikator yang sedang ditampilkan.',
      en: 'The percentage is calculated from backend data in the active scope. The value follows the indicator currently shown.',
      zh: '百分比由当前范围内的后端数据计算，数值取决于当前显示的指标类型。',
    });
  }
  if (/\d/.test(labelText)) {
    return localCopy(language, {
      id: 'Angka ini berasal dari data backend pada baris atau kartu ini, seperti jumlah submit, valid, warning, target, atau rata-rata skor.',
      en: 'This number comes from backend data on this row or card, such as submitted, valid, warning, target, or average score values.',
      zh: '该数字来自该行或卡片的后端数据，例如提交数、有效数、预警数、目标数或平均分。',
    });
  }
  return localCopy(language, {
    id: 'Chip ini merangkum field operasional yang dipakai untuk membaca status, prioritas, filter, atau keputusan verifikasi.',
    en: 'This chip summarizes an operational field used to read status, priority, filters, or verification decisions.',
    zh: '该标签汇总用于查看状态、优先级、筛选或审核决策的运营字段。',
  });
}

function Chip({ tooltip, reason, label, color, variant, ...props }: SmartChipProps) {
  const language = useCurrentLanguage();
  const labelText = labelNodeToText(label) || localCopy(language, { id: 'Chip', en: 'Chip', zh: '\u6807\u7b7e' });
  const tooltipTitle =
    tooltip ?? (
      <Box className="explain-tooltip-content">
        <Typography variant="caption" fontWeight={900}>
          {labelText}
        </Typography>
        <Typography variant="caption">{chipMeaning(labelText, color, language)}</Typography>
        <Typography variant="caption">{chipReason(labelText, reason, language)}</Typography>
      </Box>
    );

  return (
    <Tooltip arrow placement="top" title={tooltipTitle} slotProps={{ tooltip: { className: 'explain-tooltip' } }}>
      <span className="smart-chip-tooltip">
        <MuiChip label={label} color={color} variant={variant} {...props} />
      </span>
    </Tooltip>
  );
}

const languageOptions: Array<{ key: AppLanguage; shortLabel: string; label: string; nativeLabel: string }> = [
  { key: 'id', shortLabel: 'ID', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { key: 'en', shortLabel: 'EN', label: 'English', nativeLabel: 'English' },
  { key: 'zh', shortLabel: '中文', label: 'Chinese', nativeLabel: '中文' },
];

const i18nPhrases: Record<string, Record<AppLanguage, string>> = {
  'Bahasa Indonesia': { id: 'Bahasa Indonesia', en: 'Indonesian', zh: '印度尼西亚语' },
  English: { id: 'Bahasa Inggris', en: 'English', zh: '英语' },
  Chinese: { id: 'Bahasa Mandarin', en: 'Chinese', zh: '中文' },
  'Polibeli Ops': { id: 'Operasional Polibeli', en: 'Polibeli Operations', zh: 'Polibeli 运营' },
  'KLWT Cooling Parts Campaign': { id: 'Kampanye Cooling Parts KLWT', en: 'KLWT Cooling Parts Campaign', zh: 'KLWT 冷却零部件活动' },
  'Field Force Survey Management': { id: 'Manajemen Survei Field Force', en: 'Field Force Survey Management', zh: '外勤团队调研管理' },
  'Masuk sebagai tim operasional Polibeli untuk assignment, survey, verifikasi, scoring, dan export KLWT.': {
    id: 'Masuk sebagai tim operasional Polibeli untuk assignment, survei, verifikasi, scoring, dan export KLWT.',
    en: 'Sign in as the Polibeli operations team to manage KLWT assignments, surveys, verification, scoring, and exports.',
    zh: '以 Polibeli 运营团队身份登录，管理 KLWT 任务、调研、审核、评分和导出。',
  },
  'Username / nomor HP': { id: 'Username / nomor HP', en: 'Username / mobile number', zh: '用户名 / 手机号' },
  Password: { id: 'Kata sandi', en: 'Password', zh: '密码' },
  'Sembunyikan password': { id: 'Sembunyikan kata sandi', en: 'Hide password', zh: '隐藏密码' },
  'Intip password': { id: 'Tampilkan kata sandi', en: 'Show password', zh: '显示密码' },
  'Memeriksa akun...': { id: 'Memeriksa akun...', en: 'Checking account...', zh: '正在验证账号...' },
  'Masuk Dashboard': { id: 'Masuk Dashboard', en: 'Open Dashboard', zh: '进入仪表盘' },
  'Login failed': { id: 'Login gagal', en: 'Login failed', zh: '登录失败' },
  'National Progress': { id: 'Progress Nasional', en: 'National Progress', zh: '全国进度' },
  '21 hari kampanye, 16 Surveyor, 5,000 toko': { id: '21 hari kampanye, 16 Surveyor, 5.000 toko', en: '21 campaign days, 16 surveyors, 5,000 stores', zh: '21 个活动日，16 名调研员，5,000 家门店' },
  'PRD v2 ready': { id: 'Sesuai PRD v2', en: 'PRD v2 ready', zh: '符合 PRD v2' },
  'Coverage target': { id: 'Target coverage', en: 'Coverage target', zh: '覆盖目标' },
  'Active surveyors': { id: 'Surveyor aktif', en: 'Active surveyors', zh: '活跃调研员' },
  'Campaign days': { id: 'Hari kampanye', en: 'Campaign days', zh: '活动天数' },
  Workdays: { id: 'Hari kerja', en: 'Workdays', zh: '工作日' },
  'No backend data yet': { id: 'Belum ada data backend', en: 'No backend data yet', zh: '暂无后端数据' },
  'Menyiapkan KLWT cooling blitz...': { id: 'Menyiapkan blitz cooling KLWT...', en: 'Preparing the KLWT cooling blitz...', zh: '正在准备 KLWT 冷却业务攻坚...' },
  'Submitted visits': { id: 'Kunjungan terkirim', en: 'Submitted visits', zh: '已提交拜访' },
  'Verified valid': { id: 'Terverifikasi valid', en: 'Verified valid', zh: '已验证有效' },
  'Hot leads': { id: 'Hot Lead', en: 'Hot leads', zh: '高意向线索' },
  Warnings: { id: 'Peringatan', en: 'Warnings', zh: '预警' },
  '43% dari target 5,000': { id: '43% dari target 5.000', en: '43% of the 5,000 target', zh: '达到 5,000 目标的 43%' },
  '85.1% valid rate': { id: '85,1% tingkat valid', en: '85.1% valid rate', zh: '85.1% 有效率' },
  'A/A+ + terbuka + WA': { id: 'A/A+ + terbuka + WA', en: 'A/A+ + open + WA', zh: 'A/A+ + 愿意尝试 + WhatsApp' },
  'GPS, foto, duplicate': { id: 'GPS, foto, duplikat', en: 'GPS, photos, duplicates', zh: 'GPS、照片、重复' },
  'GPS, foto, duplicate, revision': { id: 'GPS, foto, duplikat, revisi', en: 'GPS, photos, duplicates, revisions', zh: 'GPS、照片、重复、修订' },
  'Command Center': { id: 'Pusat Komando', en: 'Command Center', zh: '指挥中心' },
  'Executive Dashboard': { id: 'Dashboard Eksekutif', en: 'Executive Dashboard', zh: '管理驾驶舱' },
  'Visit Planning': { id: 'Perencanaan Kunjungan', en: 'Visit Planning', zh: '拜访规划' },
  'Field Survey Workspace': { id: 'Ruang Kerja Surveyor', en: 'Field Survey Workspace', zh: '外勤调研工作台' },
  'Survey Capture Form': { id: 'Formulir Survei Lapangan', en: 'Survey Capture Form', zh: '调研采集表单' },
  'Verification Workbench': { id: 'Meja Kerja Verifikasi', en: 'Verification Workbench', zh: '审核工作台' },
  'Data Operations': { id: 'Operasi Data', en: 'Data Operations', zh: '数据运营' },
  'Access Management': { id: 'Manajemen Akses', en: 'Access Management', zh: '访问管理' },
  'Surveyor PWA': { id: 'PWA Surveyor', en: 'Surveyor PWA', zh: '调研员 PWA' },
  'Verification Queue': { id: 'Antrean Verifikasi', en: 'Verification Queue', zh: '审核队列' },
  'Market Intelligence': { id: 'Intelijen Pasar', en: 'Market Intelligence', zh: '市场情报' },
  'Admin & Export': { id: 'Admin & Export', en: 'Admin & Export', zh: '管理与导出' },
  Users: { id: 'Pengguna', en: 'Users', zh: '用户' },
  'KLWT Cooling Merchant Penetration Intelligence Platform': {
    id: 'Platform Intelijen Penetrasi Merchant Cooling KLWT',
    en: 'KLWT Cooling Merchant Penetration Intelligence Platform',
    zh: 'KLWT 冷却零部件商户渗透情报平台',
  },
  'KLWT field force': { id: 'Field force KLWT', en: 'KLWT field force', zh: 'KLWT 外勤团队' },
  'Offline-lite ready': { id: 'Offline-lite siap', en: 'Offline-lite ready', zh: '轻量离线已就绪' },
  'Draft local, sync pending, retry submit': { id: 'Draft lokal, sinkron tertunda, submit ulang', en: 'Local drafts, pending sync, retry submit', zh: '本地草稿、待同步、可重试提交' },
  'Filter data': { id: 'Filter data', en: 'Filter data', zh: '筛选数据' },
  Notifications: { id: 'Notifikasi', en: 'Notifications', zh: '通知' },
  'Role:': { id: 'Role:', en: 'Role:', zh: '角色：' },
  'Logout': { id: 'Keluar', en: 'Logout', zh: '退出登录' },
  'Open navigation': { id: 'Buka navigasi', en: 'Open navigation', zh: '打开导航' },
  'Working area': { id: 'Area kerja', en: 'Working area', zh: '工作区域' },
  'All Java': { id: 'Semua Jawa', en: 'All Java', zh: '整个爪哇' },
  'Lead segment': { id: 'Segmen lead', en: 'Lead segment', zh: '线索分组' },
  'All leads': { id: 'Semua lead', en: 'All leads', zh: '全部线索' },
  'Warning data': { id: 'Data peringatan', en: 'Warning data', zh: '预警数据' },
  'Active role:': { id: 'Role aktif:', en: 'Active role:', zh: '当前角色：' },
  'Sync healthy': { id: 'Sinkron sehat', en: 'Sync healthy', zh: '同步正常' },
  Head: { id: 'Head', en: 'Head', zh: '负责人' },
  Manager: { id: 'Manager', en: 'Manager', zh: '经理' },
  Verificator: { id: 'Verificator', en: 'Verifier', zh: '审核员' },
  Administrator: { id: 'Administrator', en: 'Administrator', zh: '管理员' },
  'National overview, manager performance, lead intelligence.': {
    id: 'Ringkasan nasional, performa manager, intelijen lead.',
    en: 'National overview, manager performance, lead intelligence.',
    zh: '全国概览、经理绩效、线索情报。',
  },
  'Executive performance, market intelligence, and final export governance.': {
    id: 'Performa eksekutif, intelijen pasar, dan tata kelola export final.',
    en: 'Executive performance, market intelligence, and final export governance.',
    zh: '管理层绩效、市场情报和最终导出治理。',
  },
  'H-1 routing, target store pool, assignment readiness.': {
    id: 'Routing H-1, pool target toko, kesiapan assignment.',
    en: 'H-1 routing, target store pool, assignment readiness.',
    zh: '前一日路线、目标门店池、任务准备情况。',
  },
  'Visit routing, target store pool, and assignment readiness.': {
    id: 'Routing kunjungan, pool target toko, dan kesiapan assignment.',
    en: 'Visit routing, target store pool, and assignment readiness.',
    zh: '拜访路线、目标门店池和任务准备情况。',
  },
  'Today Plan, Add Store, draft, history, score setelah submit.': {
    id: 'Today Plan, tambah toko, draft, histori, skor setelah submit.',
    en: 'Today Plan, add stores, drafts, history, and post-submit scores.',
    zh: '今日计划、添加门店、草稿、历史记录和提交后评分。',
  },
  'Assigned visits, manual additions, drafts, submitted reports, and submission results.': {
    id: 'Kunjungan terjadwal, penambahan manual, draft, laporan terkirim, dan hasil submit.',
    en: 'Assigned visits, manual additions, drafts, submitted reports, and submission results.',
    zh: '已分配拜访、手动新增、草稿、已提交报告和提交结果。',
  },
  'Warning queue, photo review, GPS review, duplicate decision.': {
    id: 'Antrean warning, review foto, review GPS, keputusan duplikat.',
    en: 'Warning queue, photo review, GPS review, duplicate decisions.',
    zh: '预警队列、照片审核、GPS 审核、重复判定。',
  },
  'Verification queue, evidence review, GPS validation, and duplicate decisions.': {
    id: 'Antrean verifikasi, review evidence, validasi GPS, dan keputusan duplikat.',
    en: 'Verification queue, evidence review, GPS validation, and duplicate decisions.',
    zh: '审核队列、证据审核、GPS 校验和重复判定。',
  },
  'User import, territory, options, scoring, export control.': {
    id: 'Import user, territory, opsi, scoring, kontrol export.',
    en: 'User import, territory, options, scoring, and export controls.',
    zh: '用户导入、区域、选项、评分和导出控制。',
  },
  'Master data, territory, survey options, scoring, and export controls.': {
    id: 'Master data, territory, opsi survei, scoring, dan kontrol export.',
    en: 'Master data, territory, survey options, scoring, and export controls.',
    zh: '主数据、区域、调研选项、评分和导出控制。',
  },
  'Pending verification': { id: 'Menunggu verifikasi', en: 'Pending verification', zh: '待审核' },
  'Warning Queue': { id: 'Antrean Peringatan', en: 'Warning Queue', zh: '预警队列' },
  'Warning Priority Queue': { id: 'Antrean Prioritas Peringatan', en: 'Warning Priority Queue', zh: '预警优先队列' },
  'Verification Priority Queue': { id: 'Antrean Prioritas Verifikasi', en: 'Verification Priority Queue', zh: '审核优先队列' },
  'Verification Detail': { id: 'Detail Verifikasi', en: 'Verification Detail', zh: '审核详情' },
  Pending: { id: 'Pending', en: 'Pending', zh: '待处理' },
  'Waiting + need revision': { id: 'Waiting + perlu revisi', en: 'Waiting + need revision', zh: '待审核 + 需修订' },
  'Prioritas pertama PRD': { id: 'Prioritas pertama PRD', en: 'First PRD priority', zh: 'PRD 第一优先级' },
  'GPS Warning': { id: 'Peringatan GPS', en: 'GPS Warning', zh: 'GPS 预警' },
  '>100m / perlu cek maps': { id: '>100m / perlu cek maps', en: '>100m / check map required', zh: '>100 米 / 需检查地图' },
  'Missing Photo': { id: 'Foto Belum Lengkap', en: 'Missing Photo', zh: '照片缺失' },
  'Evidence perlu review': { id: 'Evidence perlu review', en: 'Evidence needs review', zh: '证据需审核' },
  Duplicate: { id: 'Duplikat', en: 'Duplicate', zh: '重复' },
  'Candidate merge': { id: 'Kandidat merge', en: 'Merge candidate', zh: '待合并候选' },
  Rejected: { id: 'Ditolak', en: 'Rejected', zh: '已驳回' },
  'Invalid data summary': { id: 'Ringkasan data invalid', en: 'Invalid data summary', zh: '无效数据汇总' },
  Priority: { id: 'Prioritas', en: 'Priority', zh: '优先级' },
  Store: { id: 'Toko', en: 'Store', zh: '门店' },
  Lead: { id: 'Lead', en: 'Lead', zh: '线索' },
  Quality: { id: 'Kualitas', en: 'Quality', zh: '质量' },
  Status: { id: 'Status', en: 'Status', zh: '状态' },
  Age: { id: 'Umur', en: 'Age', zh: '时长' },
  'Review Detail': { id: 'Detail Review', en: 'Review Detail', zh: '审核详情' },
  'Warning first': { id: 'Prioritas warning', en: 'Warning first', zh: '预警优先' },
  'Lead potential': { id: 'Potensi lead', en: 'Lead potential', zh: '线索潜力' },
  'GPS warning': { id: 'Peringatan GPS', en: 'GPS warning', zh: 'GPS 预警' },
  'Missing photo': { id: 'Foto belum lengkap', en: 'Missing photo', zh: '照片缺失' },
  'Quality risk': { id: 'Risiko kualitas', en: 'Quality risk', zh: '质量风险' },
  Normal: { id: 'Normal', en: 'Normal', zh: '正常' },
  'Verified Valid': { id: 'Terverifikasi Valid', en: 'Verified Valid', zh: '已验证有效' },
  'Need Revision': { id: 'Perlu Revisi', en: 'Need Revision', zh: '需要修订' },
  'Rejected Invalid': { id: 'Ditolak Invalid', en: 'Rejected Invalid', zh: '无效驳回' },
  'Merge Duplicate': { id: 'Gabungkan Duplikat', en: 'Merge Duplicate', zh: '合并重复' },
  'Merged Duplicate': { id: 'Duplikat Digabung', en: 'Merged Duplicate', zh: '已合并重复' },
  'Verification notes': { id: 'Catatan verifikasi', en: 'Verification notes', zh: '审核备注' },
  'Revision request': { id: 'Permintaan revisi', en: 'Revision request', zh: '修订要求' },
  'Wajib diisi jika memilih Need Revision': { id: 'Wajib diisi jika memilih Perlu Revisi', en: 'Required when choosing Need Revision', zh: '选择需要修订时必须填写' },
  'Isi revision request sebelum mengirim Need Revision.': {
    id: 'Isi permintaan revisi sebelum mengirim Perlu Revisi.',
    en: 'Fill in the revision request before submitting Need Revision.',
    zh: '提交需要修订前，请填写修订要求。',
  },
  'Keputusan verifikasi gagal disimpan.': { id: 'Keputusan verifikasi gagal disimpan.', en: 'Failed to save verification decision.', zh: '审核决定保存失败。' },
  'Queue verifikasi gagal dimuat.': { id: 'Queue verifikasi gagal dimuat.', en: 'Failed to load verification queue.', zh: '审核队列加载失败。' },
  'Belum Diverifikasi': { id: 'Belum Diverifikasi', en: 'Unverified', zh: '未审核' },
  Tertua: { id: 'Tertua', en: 'Oldest', zh: '最久' },
  'Surveyor Aktif': { id: 'Surveyor Aktif', en: 'Active Surveyors', zh: '活跃调研员' },
  'Memiliki antrean terbuka': { id: 'Memiliki antrean terbuka', en: 'Has open queue', zh: '有待处理队列' },
  'Perlu cek koordinat': { id: 'Perlu cek koordinat', en: 'Coordinate check required', zh: '需要核对坐标' },
  'Antrean Belum Diverifikasi': { id: 'Antrean Belum Diverifikasi', en: 'Unverified Queue', zh: '未审核队列' },
  'History Verifikasi': { id: 'History Verifikasi', en: 'Verification History', zh: '审核历史' },
  'Surveyor / Store': { id: 'Surveyor / Toko', en: 'Surveyor / Store', zh: '调研员 / 门店' },
  Agregasi: { id: 'Agregasi', en: 'Aggregates', zh: '汇总' },
  Aksi: { id: 'Aksi', en: 'Action', zh: '操作' },
  data: { id: 'data', en: 'records', zh: '条数据' },
  'data sudah diverifikasi': { id: 'data sudah diverifikasi', en: 'verified records', zh: '条已审核数据' },
  terbaru: { id: 'terbaru', en: 'latest', zh: '最新' },
  Valid: { id: 'Valid', en: 'Valid', zh: '有效' },
  Revisi: { id: 'Revisi', en: 'Revision', zh: '修订' },
  Ditolak: { id: 'Ditolak', en: 'Rejected', zh: '已驳回' },
  Anulir: { id: 'Anulir', en: 'Annul', zh: '撤销' },
  'Anulir Status Verifikasi': { id: 'Anulir Status Verifikasi', en: 'Annul Verification Status', zh: '撤销审核状态' },
  'Anulir dan kembalikan ke antrean': { id: 'Anulir dan kembalikan ke antrean', en: 'Annul and return to queue', zh: '撤销并返回队列' },
  'Memproses...': { id: 'Memproses...', en: 'Processing...', zh: '处理中...' },
  'Tidak ada history pada grup ini.': { id: 'Tidak ada history pada grup ini.', en: 'No history in this group.', zh: '此组暂无历史记录。' },
  'Belum ada history verifikasi.': { id: 'Belum ada history verifikasi.', en: 'No verification history yet.', zh: '暂无审核历史。' },
  'Ada catatan': { id: 'Ada catatan', en: 'Has note', zh: '有备注' },
  'toko belum diverifikasi': { id: 'toko belum diverifikasi', en: 'unverified stores', zh: '家未审核门店' },
  'umur tertua': { id: 'umur tertua', en: 'oldest age', zh: '最久时长' },
  Foto: { id: 'Foto', en: 'Photo', zh: '照片' },
  Duplikat: { id: 'Duplikat', en: 'Duplicate', zh: '重复' },
  Collapse: { id: 'Tutup', en: 'Collapse', zh: '收起' },
  Expand: { id: 'Buka', en: 'Expand', zh: '展开' },
  'Tidak ada antrean verifikasi terbuka.': { id: 'Tidak ada antrean verifikasi terbuka.', en: 'No open verification queue.', zh: '没有待审核队列。' },
  'Revision request wajib diisi untuk Need Revision.': {
    id: 'Permintaan revisi wajib diisi untuk Perlu Revisi.',
    en: 'Revision request is required for Need Revision.',
    zh: '选择需要修订时必须填写修订要求。',
  },
  'Pilih Toko Duplikat': { id: 'Pilih Toko Duplikat', en: 'Select Duplicate Store', zh: '选择重复门店' },
  'Pilih toko yang menjadi data induk untuk penggabungan duplicate.': {
    id: 'Pilih toko yang menjadi data induk untuk penggabungan duplikat.',
    en: 'Select the master store record for this duplicate merge.',
    zh: '请选择用于合并重复数据的主门店记录。',
  },
  Match: { id: 'Kecocokan', en: 'Match', zh: '匹配度' },
  'Tidak ada kandidat duplicate yang cocok.': { id: 'Tidak ada kandidat duplikat yang cocok.', en: 'No matching duplicate candidates.', zh: '没有匹配的重复候选。' },
  'Merge Dengan Toko Ini': { id: 'Gabungkan dengan Toko Ini', en: 'Merge With This Store', zh: '与此门店合并' },
  Front: { id: 'Depan', en: 'Front', zh: '门头' },
  Rack: { id: 'Rak', en: 'Rack', zh: '货架' },
  PIC: { id: 'PIC', en: 'PIC', zh: '联系人' },
  Available: { id: 'Tersedia', en: 'Available', zh: '可用' },
  Missing: { id: 'Belum ada', en: 'Missing', zh: '缺失' },
  WhatsApp: { id: 'WhatsApp', en: 'WhatsApp', zh: 'WhatsApp' },
  'Kirim WhatsApp': { id: 'Kirim WhatsApp', en: 'Send WhatsApp', zh: '发送 WhatsApp' },
  'Nomor WA belum tersedia': { id: 'Nomor WA belum tersedia', en: 'WhatsApp number is not available', zh: 'WhatsApp 号码不可用' },
  'Tidak ada nomor': { id: 'Tidak ada nomor', en: 'No number available', zh: '无号码' },
  'Koordinat toko': { id: 'Koordinat toko', en: 'Store coordinates', zh: '门店坐标' },
  'Buka Google Maps': { id: 'Buka Google Maps', en: 'Open Google Maps', zh: '打开 Google 地图' },
  'Koordinat belum tersedia': { id: 'Koordinat belum tersedia', en: 'Coordinates are not available', zh: '坐标不可用' },
  Alamat: { id: 'Alamat', en: 'Address', zh: '地址' },
  GPS: { id: 'GPS', en: 'GPS', zh: 'GPS' },
  'Photo Evidence': { id: 'Evidence Foto', en: 'Photo Evidence', zh: '照片证据' },
  'Cooling vs Supplier': { id: 'Cooling vs Supplier', en: 'Cooling vs Supplier', zh: '冷却产品与供应商' },
  'WA Rule': { id: 'Aturan WA', en: 'WA Rule', zh: 'WhatsApp 规则' },
  'Ada evidence yang belum lengkap': { id: 'Ada evidence yang belum lengkap', en: 'Some evidence is incomplete', zh: '部分证据不完整' },
  'Front, rack, dan PIC tersedia': { id: 'Foto depan, rak, dan PIC tersedia', en: 'Front, rack, and PIC photos are available', zh: '门头、货架和联系人照片均已提供' },
  'Belum ada exact match': { id: 'Belum ada exact match', en: 'No exact match yet', zh: '暂无精确匹配' },
  'Possible duplicate, gunakan Merge Duplicate bila valid': {
    id: 'Possible duplicate, gunakan Gabungkan Duplikat bila valid',
    en: 'Possible duplicate, use Merge Duplicate if valid',
    zh: '可能重复，确认后使用合并重复',
  },
  'WA tersedia, eligible Hot Lead jika score tinggi': {
    id: 'WA tersedia, eligible Hot Lead jika skor tinggi',
    en: 'WA available, eligible as Hot Lead if score is high',
    zh: 'WhatsApp 可用，评分高时可成为高意向线索',
  },
  'WA kosong tanpa alasan': { id: 'WA kosong tanpa alasan', en: 'WA is missing without a reason', zh: '未填写 WhatsApp 且无原因' },
  'Tidak ada queue verifikasi.': { id: 'Tidak ada antrean verifikasi.', en: 'No verification queue.', zh: '没有审核队列。' },
  'H-1 Visit Plan': { id: 'Rencana Kunjungan H-1', en: 'H-1 Visit Plan', zh: '前一日拜访计划' },
  Import: { id: 'Import', en: 'Import', zh: '导入' },
  Assign: { id: 'Assign', en: 'Assign', zh: '分配' },
  'Visit date': { id: 'Tanggal kunjungan', en: 'Visit date', zh: '拜访日期' },
  City: { id: 'Kota', en: 'City', zh: '城市' },
  'Search store': { id: 'Cari toko', en: 'Search store', zh: '搜索门店' },
  'Nama toko atau kecamatan': { id: 'Nama toko atau kecamatan', en: 'Store name or district', zh: '门店名称或区县' },
  'Assigned Store Pool by Area': { id: 'Pool Toko Assigned per Area', en: 'Assigned Store Pool by Area', zh: '按区域分配的门店池' },
  'Coverage by Area': { id: 'Cakupan per Area', en: 'Coverage by Area', zh: '按区域覆盖' },
  'Area Capacity': { id: 'Kapasitas Area', en: 'Area Capacity', zh: '区域容量' },
  'All cities': { id: 'Semua kota', en: 'All cities', zh: '所有城市' },
  'All managers': { id: 'Semua manager', en: 'All managers', zh: '所有经理' },
  'No GPS yet': { id: 'Belum ada GPS', en: 'No GPS yet', zh: '暂无 GPS' },
  Ready: { id: 'Siap', en: 'Ready', zh: '就绪' },
  Candidate: { id: 'Kandidat', en: 'Candidate', zh: '候选' },
  Revisit: { id: 'Revisit', en: 'Revisit', zh: '复访' },
  Planned: { id: 'Terencana', en: 'Planned', zh: '计划内' },
  'Imported Target': { id: 'Target Import', en: 'Imported Target', zh: '导入目标' },
  'Import Target Store': { id: 'Import Target Toko', en: 'Import Target Store', zh: '导入目标门店' },
  'Reassign Store': { id: 'Reassign Toko', en: 'Reassign Store', zh: '重新分配门店' },
  'Assign Store': { id: 'Assign Toko', en: 'Assign Store', zh: '分配门店' },
  'Store name': { id: 'Nama toko', en: 'Store name', zh: '门店名称' },
  Province: { id: 'Provinsi', en: 'Province', zh: '省份' },
  District: { id: 'Kecamatan', en: 'District', zh: '区县' },
  Village: { id: 'Desa/Kelurahan', en: 'Village', zh: '村/街道' },
  Surveyor: { id: 'Surveyor', en: 'Surveyor', zh: '调研员' },
  'Save Assignment': { id: 'Simpan Assignment', en: 'Save Assignment', zh: '保存分配' },
  Cancel: { id: 'Batal', en: 'Cancel', zh: '取消' },
  Submit: { id: 'Kirim', en: 'Submit', zh: '提交' },
  Download: { id: 'Unduh', en: 'Download', zh: '下载' },
  Export: { id: 'Export', en: 'Export', zh: '导出' },
  'Select Import File': { id: 'Pilih File Import', en: 'Select Import File', zh: '选择导入文件' },
  'Click or drop the completed template here': {
    id: 'Klik atau tarik template yang sudah diisi ke sini',
    en: 'Click or drop the completed template here',
    zh: '点击或拖放已填写的模板',
  },
  'Only .xlsx file format is supported.': { id: 'Hanya file .xlsx yang didukung.', en: 'Only .xlsx file format is supported.', zh: '仅支持 .xlsx 文件格式。' },
  'Click to download the import template': {
    id: 'Klik untuk mengunduh template import',
    en: 'Click to download the import template',
    zh: '点击下载导入模板',
  },
  'Close import dialog': { id: 'Tutup dialog import', en: 'Close import dialog', zh: '关闭导入窗口' },
  'Import User': { id: 'Import User', en: 'Import User', zh: '导入用户' },
  'Import Master Survey Options': { id: 'Import Master Opsi Survey', en: 'Import Master Survey Options', zh: '导入调研选项主数据' },
  'Import Territory Master': { id: 'Import Master Territory', en: 'Import Territory Master', zh: '导入区域主数据' },
  'User import': { id: 'Import user', en: 'User import', zh: '用户导入' },
  'Target store import': { id: 'Import target toko', en: 'Target store import', zh: '目标门店导入' },
  'Master survey options': { id: 'Master opsi survey', en: 'Master survey options', zh: '调研选项主数据' },
  'Territory master': { id: 'Master territory', en: 'Territory master', zh: '区域主数据' },
  'System Setup': { id: 'Setup Sistem', en: 'System Setup', zh: '系统设置' },
  'Import Templates': { id: 'Template Import', en: 'Import Templates', zh: '导入模板' },
  'Export Jobs': { id: 'Job Export', en: 'Export Jobs', zh: '导出任务' },
  'All Survey Data': { id: 'Semua Data Survey', en: 'All Survey Data', zh: '全部调研数据' },
  'Verified Store Database': { id: 'Database Toko Terverifikasi', en: 'Verified Store Database', zh: '已验证门店数据库' },
  'Hot Lead / Qualified Lead': { id: 'Hot Lead / Qualified Lead', en: 'Hot Lead / Qualified Lead', zh: '高意向 / 合格线索' },
  'Supplier & Brand Intelligence': { id: 'Intelijen Supplier & Brand', en: 'Supplier & Brand Intelligence', zh: '供应商与品牌情报' },
  Scope: { id: 'Scope', en: 'Scope', zh: '范围' },
  Processing: { id: 'Diproses', en: 'Processing', zh: '处理中' },
  'Processing...': { id: 'Diproses...', en: 'Processing...', zh: '处理中...' },
  'Bulk import user': { id: 'Bulk import user', en: 'Bulk import user', zh: '批量导入用户' },
  'Territory dropdown Indonesia': { id: 'Dropdown territory Indonesia', en: 'Indonesia territory dropdown', zh: '印尼区域下拉选项' },
  'Fixed scoring formula v1': { id: 'Formula scoring tetap v1', en: 'Fixed scoring formula v1', zh: '固定评分公式 v1' },
  'Export access control': { id: 'Kontrol akses export', en: 'Export access control', zh: '导出权限控制' },
  'Phase 2 map dashboard': { id: 'Dashboard peta fase 2', en: 'Phase 2 map dashboard', zh: '第二阶段地图仪表盘' },
  'Surveyor Progress': { id: 'Progress Surveyor', en: 'Surveyor Progress', zh: '调研员进度' },
  'Field Team Progress': { id: 'Progress Tim Lapangan', en: 'Field Team Progress', zh: '外勤团队进度' },
  'Submitted Store History by Surveyor': { id: 'Histori Submit Toko per Surveyor', en: 'Submitted Store History by Surveyor', zh: '按调研员查看已提交门店历史' },
  'Submitted Report History': { id: 'Riwayat Laporan Terkirim', en: 'Submitted Report History', zh: '已提交报告历史' },
  'Histori Submit Toko': { id: 'Histori Submit Toko', en: 'Submitted Store History', zh: '已提交门店历史' },
  'Raw Evidence Foto Link': { id: 'Link Raw Evidence Foto', en: 'Raw Photo Evidence Links', zh: '\u539f\u59cb\u7167\u7247\u8bc1\u636e\u94fe\u63a5' },
  'Surveyor Performance': { id: 'Performa Surveyor', en: 'Surveyor Performance', zh: '\u8c03\u7814\u5458\u7ee9\u6548' },
  'Export owner': { id: 'Pemilik', en: 'Owner', zh: '\u8d1f\u8d23\u4eba' },
  'Backend SQLite': { id: 'Backend SQLite', en: 'Backend SQLite', zh: 'SQLite \u540e\u7aef' },
  'Camera-only evidence': { id: 'Evidence kamera langsung', en: 'Camera-only evidence', zh: '\u4ec5\u9650\u76f8\u673a\u62cd\u6444\u8bc1\u636e' },
  'Role based access': { id: 'Akses berbasis role', en: 'Role-based access', zh: '\u57fa\u4e8e\u89d2\u8272\u7684\u8bbf\u95ee\u63a7\u5236' },
  'Native camera capture + backend evidence URL': {
    id: 'Kamera native perangkat + URL evidence dari backend',
    en: 'Native device camera capture + backend evidence URL',
    zh: '\u8bbe\u5907\u539f\u751f\u76f8\u673a\u62cd\u6444 + \u540e\u7aef\u8bc1\u636e\u94fe\u63a5',
  },
  'Frontend navigation + backend API guard': {
    id: 'Navigasi frontend + guard API backend',
    en: 'Frontend navigation + backend API guard',
    zh: '\u524d\u7aef\u5bfc\u822a\u4e0e\u540e\u7aef API \u6743\u9650\u4fdd\u62a4',
  },
  'survey rows': { id: 'baris survey', en: 'survey rows', zh: '\u6761\u8c03\u7814\u8bb0\u5f55' },
  locations: { id: 'lokasi', en: 'locations', zh: '\u4e2a\u5730\u533a' },
  rows: { id: 'baris', en: 'rows', zh: '\u884c' },
  'Klik nama surveyor untuk melihat histori submit toko.': {
    id: 'Klik nama surveyor untuk melihat histori submit toko.',
    en: 'Click a surveyor name to view their submitted store history.',
    zh: '点击调研员姓名查看其已提交门店历史。',
  },
  'Klik baris surveyor untuk melihat histori submit toko.': {
    id: 'Klik baris surveyor untuk melihat histori submit toko.',
    en: 'Click a surveyor row to view their submitted store history.',
    zh: '点击调研员行查看其已提交门店历史。',
  },
  'Klik row toko untuk membuka detail survey.': {
    id: 'Klik row toko untuk membuka detail survey.',
    en: 'Click a store row to open the survey detail.',
    zh: '点击门店行打开调研详情。',
  },
  'Detail Survey': { id: 'Detail Survey', en: 'Survey Detail', zh: '调研详情' },
  'Kembali ke Progress Surveyor': { id: 'Kembali ke Progress Surveyor', en: 'Back to Surveyor Progress', zh: '返回调研员进度' },
  'Tutup Detail': { id: 'Tutup Detail', en: 'Close Detail', zh: '关闭详情' },
  'Ringkasan Survey': { id: 'Ringkasan Survey', en: 'Survey Summary', zh: '调研概要' },
  'Detail Lokasi': { id: 'Detail Lokasi', en: 'Location Detail', zh: '位置详情' },
  'Kontak & Bisnis': { id: 'Kontak & Bisnis', en: 'Contact & Business', zh: '联系人与业务' },
  'Komersial & Follow-up': { id: 'Komersial & Follow-up', en: 'Commercial & Follow-up', zh: '商业与跟进' },
  'Dijalankan oleh': { id: 'Dijalankan oleh', en: 'Submitted by', zh: '提交人' },
  'Tidak ada histori submit untuk surveyor ini.': {
    id: 'Tidak ada histori submit untuk surveyor ini.',
    en: 'No submitted store history for this surveyor yet.',
    zh: '该调研员暂无已提交门店历史。',
  },
  'Export Histori': { id: 'Export Histori', en: 'Export History', zh: '导出历史' },
  'Tutup': { id: 'Tutup', en: 'Close', zh: '关闭' },
  'Semua submit survey yang tersimpan di database, dikelompokkan per surveyor.': {
    id: 'Semua submit survey yang tersimpan di database, dikelompokkan per surveyor.',
    en: 'All survey submissions stored in the database, grouped by surveyor.',
    zh: '数据库中的全部调研提交，按调研员分组。',
  },
  'Expand all': { id: 'Buka semua', en: 'Expand all', zh: '全部展开' },
  'Collapse all': { id: 'Tutup semua', en: 'Collapse all', zh: '全部收起' },
  records: { id: 'record', en: 'records', zh: '条记录' },
  'Total Users': { id: 'Total Pengguna', en: 'Total Users', zh: '用户总数' },
  'Active Users': { id: 'Pengguna Aktif', en: 'Active Users', zh: '活跃用户' },
  'Inactive Users': { id: 'Pengguna Nonaktif', en: 'Inactive Users', zh: '停用用户' },
  'Registered Polibeli accounts': { id: 'Akun Polibeli terdaftar', en: 'Registered Polibeli accounts', zh: '已注册 Polibeli 账号' },
  'Can access campaign app': { id: 'Dapat mengakses aplikasi campaign', en: 'Can access campaign app', zh: '可访问活动应用' },
  'Login access disabled': { id: 'Akses login dinonaktifkan', en: 'Login access disabled', zh: '登录权限已禁用' },
  'Polibeli User Access': { id: 'Akses User Polibeli', en: 'Polibeli User Access', zh: 'Polibeli 用户权限' },
  'User Access Management': { id: 'Manajemen Akses Pengguna', en: 'User Access Management', zh: '用户访问管理' },
  'Add User': { id: 'Tambah User', en: 'Add User', zh: '添加用户' },
  User: { id: 'User', en: 'User', zh: '用户' },
  Username: { id: 'Username', en: 'Username', zh: '用户名' },
  'Phone Number': { id: 'Nomor HP', en: 'Phone Number', zh: '手机号' },
  Role: { id: 'Role', en: 'Role', zh: '角色' },
  Actions: { id: 'Aksi', en: 'Actions', zh: '操作' },
  'Detail User': { id: 'Detail User', en: 'User Details', zh: '用户详情' },
  'Full Name': { id: 'Nama lengkap', en: 'Full Name', zh: '姓名' },
  'Leave blank to keep current password, or type a new one.': {
    id: 'Kosongkan untuk mempertahankan password saat ini, atau isi password baru.',
    en: 'Leave blank to keep the current password, or enter a new one.',
    zh: '留空保留当前密码，或输入新密码。',
  },
  'Set initial password for this user.': { id: 'Set password awal untuk user ini.', en: 'Set the initial password for this user.', zh: '为该用户设置初始密码。' },
  'Required for Surveyor accounts.': { id: 'Wajib untuk akun Surveyor.', en: 'Required for Surveyor accounts.', zh: '调研员账号必填。' },
  'Save Changes': { id: 'Simpan Perubahan', en: 'Save Changes', zh: '保存修改' },
  'Saving...': { id: 'Menyimpan...', en: 'Saving...', zh: '正在保存...' },
  'Delete User': { id: 'Hapus User', en: 'Delete User', zh: '删除用户' },
  'Delete user': { id: 'Hapus user', en: 'Delete user', zh: '删除用户' },
  'Detail / edit user': { id: 'Detail / edit user', en: 'View / edit user', zh: '查看 / 编辑用户' },
  'Deactivate user': { id: 'Nonaktifkan user', en: 'Deactivate user', zh: '停用用户' },
  'Activate user': { id: 'Aktifkan user', en: 'Activate user', zh: '启用用户' },
  Detail: { id: 'Detail', en: 'Detail', zh: '详情' },
  Aktifkan: { id: 'Aktifkan', en: 'Activate', zh: '启用' },
  Nonaktifkan: { id: 'Nonaktifkan', en: 'Deactivate', zh: '停用' },
  Active: { id: 'Aktif', en: 'Active', zh: '启用' },
  Inactive: { id: 'Nonaktif', en: 'Inactive', zh: '停用' },
  Unassigned: { id: 'Belum assigned', en: 'Unassigned', zh: '未分配' },
  'Unassigned manager': { id: 'Manager belum assigned', en: 'Unassigned manager', zh: '未分配经理' },
  'No manager required': { id: 'Tidak perlu manager', en: 'No manager required', zh: '无需经理' },
  'Command metrics': { id: 'Metrik komando', en: 'Command metrics', zh: '指挥指标' },
  'Supplier dissatisfaction': { id: 'Ketidakpuasan supplier', en: 'Supplier dissatisfaction', zh: '供应商不满意度' },
  'Low cost import acceptance': { id: 'Penerimaan import low cost', en: 'Low-cost import acceptance', zh: '低价进口接受度' },
  'Owner reachable by WA': { id: 'Owner bisa dihubungi via WA', en: 'Owner reachable by WA', zh: '店主可通过 WhatsApp 联系' },
  'Data quality good': { id: 'Kualitas data baik', en: 'Data quality good', zh: '数据质量良好' },
  'Avg Merchant Score': { id: 'Rata-rata Skor Merchant', en: 'Avg Merchant Score', zh: '商户平均评分' },
  'Avg Data Quality': { id: 'Rata-rata Kualitas Data', en: 'Avg Data Quality', zh: '平均数据质量' },
  'WA Contactability': { id: 'Keterhubungan WA', en: 'WA Contactability', zh: 'WhatsApp 可联系率' },
  'A range improving': { id: 'Rentang A membaik', en: 'A range improving', zh: 'A 级区间持续改善' },
  'Good confidence': { id: 'Confidence baik', en: 'Good confidence', zh: '置信度良好' },
  'Hot lead eligible': { id: 'Eligible Hot Lead', en: 'Hot lead eligible', zh: '符合高意向线索' },
  Business: { id: 'Bisnis', en: 'Business', zh: '业务' },
  Cooling: { id: 'Cooling', en: 'Cooling', zh: '冷却产品' },
  Supplier: { id: 'Supplier', en: 'Supplier', zh: '供应商' },
  Commercial: { id: 'Komersial', en: 'Commercial', zh: '商业' },
  Openness: { id: 'Keterbukaan', en: 'Openness', zh: '开放度' },
  Photos: { id: 'Foto', en: 'Photos', zh: '照片' },
  Review: { id: 'Review', en: 'Review', zh: '复核' },
  Start: { id: 'Mulai', en: 'Start', zh: '开始' },
  Back: { id: 'Kembali', en: 'Back', zh: '返回' },
  Next: { id: 'Lanjut', en: 'Next', zh: '下一步' },
  'Save Draft': { id: 'Simpan Draft', en: 'Save Draft', zh: '保存草稿' },
  'Submit Survey': { id: 'Submit Survey', en: 'Submit Survey', zh: '提交调研' },
  'Submitting...': { id: 'Mengirim...', en: 'Submitting...', zh: '正在提交...' },
  'Add Unplanned Store': { id: 'Tambah Toko Unplanned', en: 'Add Unplanned Store', zh: '添加计划外门店' },
  'Add Manual Visit': { id: 'Tambah Kunjungan Manual', en: 'Add Manual Visit', zh: '新增手动拜访' },
  'Today Plan': { id: 'Today Plan', en: 'Today Plan', zh: '今日计划' },
  'Assigned Visits': { id: 'Kunjungan Terjadwal', en: 'Assigned Visits', zh: '已分配拜访' },
  'Revision Queue': { id: 'Antrean Revisi', en: 'Revision Queue', zh: '修订队列' },
  'Submitted Reports': { id: 'Laporan Terkirim', en: 'Submitted Reports', zh: '已提交报告' },
  'Add Store': { id: 'Tambah Toko', en: 'Add Store', zh: '添加门店' },
  'Survey Submitted': { id: 'Survey Terkirim', en: 'Survey Submitted', zh: '调研已提交' },
  'Tap nama toko di Today Plan': { id: 'Tap nama toko di Today Plan', en: 'Tap a store name in Today Plan', zh: '点击今日计划中的门店名称' },
  'Select a visit from the list': { id: 'Pilih kunjungan dari daftar', en: 'Select a visit from the list', zh: '从列表中选择拜访' },
  'Tekan Save Draft di form survey untuk menyimpan pekerjaan sementara.': {
    id: 'Tekan Simpan Draft di form survey untuk menyimpan pekerjaan sementara.',
    en: 'Tap Save Draft in the survey form to save temporary work.',
    zh: '在调研表单中点击保存草稿以保存临时工作。',
  },
  'Pilih toko dari list terlebih dahulu sebelum menyimpan draft.': {
    id: 'Pilih toko dari list terlebih dahulu sebelum menyimpan draft.',
    en: 'Select a store from the list before saving a draft.',
    zh: '保存草稿前请先从列表选择门店。',
  },
  'Draft disimpan': { id: 'Draft disimpan', en: 'Draft saved', zh: '草稿已保存' },
  'Lengkapi field wajib sebelum submit survey.': {
    id: 'Lengkapi field wajib sebelum submit survey.',
    en: 'Complete all required fields before submitting the survey.',
    zh: '提交调研前请完成所有必填字段。',
  },
  'Alamat harus valid dari master lokasi Jawa.': {
    id: 'Alamat harus valid dari master lokasi Jawa.',
    en: 'Address must be valid against the Java location master.',
    zh: '地址必须通过爪哇区域主数据校验。',
  },
  'Alamat detail wajib diisi.': { id: 'Alamat detail wajib diisi.', en: 'Detailed address is required.', zh: '详细地址为必填项。' },
  'Landmark/patokan wajib diisi.': { id: 'Landmark/patokan wajib diisi.', en: 'Landmark/reference point is required.', zh: '地标/参照点为必填项。' },
  'GPS wajib dicapture.': { id: 'GPS wajib dicapture.', en: 'GPS must be captured.', zh: '必须采集 GPS。' },
  'Jika WA kosong, alasan wajib dipilih.': { id: 'Jika WA kosong, alasan wajib dipilih.', en: 'If WA is empty, a reason must be selected.', zh: '若未填写 WhatsApp，必须选择原因。' },
  'Foto tampak depan wajib untuk Survey Completed.': {
    id: 'Foto tampak depan wajib untuk Survey Completed.',
    en: 'Front-store photo is required for Survey Completed.',
    zh: '完成调研必须上传门头照片。',
  },
  'Alasan foto dalam/rak kosong': { id: 'Alasan foto dalam/rak kosong', en: 'Reason for missing interior/rack photo', zh: '缺少店内/货架照片原因' },
  'Alasan foto PIC kosong': { id: 'Alasan foto PIC kosong', en: 'Reason for missing PIC photo', zh: '缺少联系人照片原因' },
  'WhatsApp number': { id: 'Nomor WhatsApp', en: 'WhatsApp number', zh: 'WhatsApp 号码' },
  'Visit Outcome': { id: 'Hasil Kunjungan', en: 'Visit Outcome', zh: '拜访结果' },
  'Store Closed': { id: 'Toko Tutup', en: 'Store Closed', zh: '门店关闭' },
  'Address Not Found': { id: 'Alamat Tidak Ditemukan', en: 'Address Not Found', zh: '地址未找到' },
  'Moved Location': { id: 'Pindah Lokasi', en: 'Moved Location', zh: '已搬迁' },
  Refused: { id: 'Menolak', en: 'Refused', zh: '拒绝' },
  'Not Relevant Store': { id: 'Toko Tidak Relevan', en: 'Not Relevant Store', zh: '非相关门店' },
  'Duplicate Found': { id: 'Duplikat Ditemukan', en: 'Duplicate Found', zh: '发现重复' },
  'Need Revisit': { id: 'Perlu Revisit', en: 'Need Revisit', zh: '需要复访' },
  Owner: { id: 'Owner', en: 'Owner', zh: '店主' },
  Karyawan: { id: 'Karyawan', en: 'Employee', zh: '员工' },
  'Owner/PIC menolak memberi nomor': { id: 'Owner/PIC menolak memberi nomor', en: 'Owner/PIC declined to provide a number', zh: '店主/联系人拒绝提供号码' },
  'Owner/PIC tidak tersedia': { id: 'Owner/PIC tidak tersedia', en: 'Owner/PIC is not available', zh: '店主/联系人不在' },
  'Toko tidak memiliki nomor WA bisnis': { id: 'Toko tidak memiliki nomor WA bisnis', en: 'Store does not have a business WA number', zh: '门店没有业务 WhatsApp 号码' },
  'Akan diberikan saat revisit': { id: 'Akan diberikan saat revisit', en: 'Will be provided during revisit', zh: '复访时提供' },
  Lainnya: { id: 'Lainnya', en: 'Other', zh: '其他' },
  'Anak owner / family': { id: 'Anak owner / keluarga', en: "Owner's child / family", zh: '店主子女 / 家属' },
  'Kepala toko': { id: 'Kepala toko', en: 'Store supervisor', zh: '店长' },
  Mekanik: { id: 'Mekanik', en: 'Mechanic', zh: '技师' },
  'Staff pembelian': { id: 'Staff pembelian', en: 'Purchasing staff', zh: '采购人员' },
  'Selalu ada': { id: 'Selalu ada', en: 'Always available', zh: '经常在店' },
  'Pagi saja': { id: 'Pagi saja', en: 'Morning only', zh: '仅上午' },
  'Sore saja': { id: 'Sore saja', en: 'Afternoon only', zh: '仅下午' },
  'By phone/WA': { id: 'Via telepon/WA', en: 'By phone/WA', zh: '通过电话/WhatsApp' },
  'Jarang datang': { id: 'Jarang datang', en: 'Rarely visits', zh: '很少到店' },
  'General Sparepart Retail': { id: 'Retail sparepart umum', en: 'General Sparepart Retail', zh: '通用零部件零售' },
  'Wholesale Sparepart Distributor': { id: 'Distributor grosir sparepart', en: 'Wholesale Sparepart Distributor', zh: '零部件批发分销商' },
  'Workshop / Repair Garage': { id: 'Bengkel / Reparasi', en: 'Workshop / Repair Garage', zh: '维修车间' },
  'Specialist Workshop': { id: 'Bengkel spesialis', en: 'Specialist Workshop', zh: '专业维修店' },
  'Cooling Specialist / Radiator Shop': { id: 'Spesialis cooling / toko radiator', en: 'Cooling Specialist / Radiator Shop', zh: '冷却系统 / 水箱专营店' },
  'AC & Cooling Specialist': { id: 'Spesialis AC & cooling', en: 'AC & Cooling Specialist', zh: '空调与冷却系统专营' },
  'Multi-Service Auto Center': { id: 'Auto center multi-layanan', en: 'Multi-Service Auto Center', zh: '综合汽车服务中心' },
  'Fleet / Commercial Workshop': { id: 'Bengkel fleet / komersial', en: 'Fleet / Commercial Workshop', zh: '车队 / 商用车维修店' },
  'Other Automotive Merchant': { id: 'Merchant otomotif lainnya', en: 'Other Automotive Merchant', zh: '其他汽车商户' },
  Small: { id: 'Kecil', en: 'Small', zh: '小型' },
  Medium: { id: 'Sedang', en: 'Medium', zh: '中型' },
  Large: { id: 'Besar', en: 'Large', zh: '大型' },
  'Wholesale / Distributor scale': { id: 'Skala grosir / distributor', en: 'Wholesale / Distributor scale', zh: '批发 / 分销规模' },
  Radiator: { id: 'Radiator', en: 'Radiator', zh: '水箱' },
  Condenser: { id: 'Kondensor', en: 'Condenser', zh: '冷凝器' },
  'Cooling Fan': { id: 'Kipas cooling', en: 'Cooling Fan', zh: '冷却风扇' },
  'Water Pump': { id: 'Water Pump', en: 'Water Pump', zh: '水泵' },
  'Radiator Hose': { id: 'Selang radiator', en: 'Radiator Hose', zh: '水箱软管' },
  'Radiator Cap': { id: 'Tutup radiator', en: 'Radiator Cap', zh: '水箱盖' },
  'Coolant Accessories': { id: 'Aksesori coolant', en: 'Coolant Accessories', zh: '冷却液配件' },
  'Tidak terlihat / tidak menjual cooling parts': {
    id: 'Tidak terlihat / tidak menjual cooling parts',
    en: 'Not visible / does not sell cooling parts',
    zh: '未看到 / 不销售冷却零部件',
  },
  'Tidak terlihat cooling parts': { id: 'Cooling parts tidak terlihat', en: 'Cooling parts not visible', zh: '未看到冷却零部件' },
  Sedikit: { id: 'Sedikit', en: 'Few', zh: '少量' },
  Banyak: { id: 'Banyak', en: 'Many', zh: '大量' },
  'Banyak / dominan': { id: 'Banyak / dominan', en: 'Many / dominant', zh: '大量 / 主导' },
  Jarang: { id: 'Jarang', en: 'Rarely', zh: '很少' },
  Kadang: { id: 'Kadang', en: 'Sometimes', zh: '有时' },
  'Cukup rutin': { id: 'Cukup rutin', en: 'Fairly routine', zh: '较常规' },
  'Sangat rutin': { id: 'Sangat rutin', en: 'Very routine', zh: '非常常规' },
  'Tidak tahu / tidak terlihat': { id: 'Tidak tahu / tidak terlihat', en: 'Unknown / not visible', zh: '不知道 / 未看到' },
  'Tidak tahu': { id: 'Tidak tahu', en: 'Unknown', zh: '不知道' },
  'Tidak ada': { id: 'Tidak ada', en: 'None', zh: '无' },
  Campuran: { id: 'Campuran', en: 'Mixed', zh: '混合' },
  Dominan: { id: 'Dominan', en: 'Dominant', zh: '主导' },
  'Genuine Premium Dominant': { id: 'Dominan genuine premium', en: 'Genuine Premium Dominant', zh: '原厂高端为主' },
  'OEM Trusted Dominant': { id: 'Dominan OEM trusted', en: 'OEM Trusted Dominant', zh: '可信 OEM 为主' },
  'Mid Aftermarket Mixed': { id: 'Campuran aftermarket menengah', en: 'Mid Aftermarket Mixed', zh: '中端售后混合' },
  'Economy / Low Cost Dominant': { id: 'Dominan ekonomi / low cost', en: 'Economy / Low Cost Dominant', zh: '经济 / 低价为主' },
  'Sales distributor datang': { id: 'Sales distributor datang', en: 'Distributor sales visit', zh: '分销商销售来访' },
  'Grosir langganan': { id: 'Grosir langganan', en: 'Regular wholesaler', zh: '固定批发商' },
  Importir: { id: 'Importir', en: 'Importer', zh: '进口商' },
  Marketplace: { id: 'Marketplace', en: 'Marketplace', zh: '电商平台' },
  'Ambil sendiri': { id: 'Ambil sendiri', en: 'Self pickup', zh: '自提' },
  Campur: { id: 'Campur', en: 'Mixed', zh: '混合' },
  'Sangat tergantung 1 supplier': { id: 'Sangat tergantung 1 supplier', en: 'Highly dependent on one supplier', zh: '高度依赖单一供应商' },
  '2-3 supplier tetap': { id: '2-3 supplier tetap', en: '2-3 regular suppliers', zh: '2-3 个固定供应商' },
  'Supplier campuran fleksibel': { id: 'Supplier campuran fleksibel', en: 'Flexible mixed suppliers', zh: '灵活混合供应商' },
  'Opportunistic buyer': { id: 'Opportunistic buyer', en: 'Opportunistic buyer', zh: '机会型采购' },
  'Sangat puas': { id: 'Sangat puas', en: 'Very satisfied', zh: '非常满意' },
  'Cukup puas': { id: 'Cukup puas', en: 'Fairly satisfied', zh: '比较满意' },
  'Banyak keluhan': { id: 'Banyak keluhan', en: 'Many complaints', zh: '投诉较多' },
  'Sedang cari alternatif': { id: 'Sedang cari alternatif', en: 'Looking for alternatives', zh: '正在寻找替代供应商' },
  'Sangat mudah': { id: 'Sangat mudah', en: 'Very easy', zh: '非常容易' },
  'Cukup mudah': { id: 'Cukup mudah', en: 'Fairly easy', zh: '比较容易' },
  'Agak sulit': { id: 'Agak sulit', en: 'Somewhat difficult', zh: '有点困难' },
  'Sulit / hampir tidak bisa': { id: 'Sulit / hampir tidak bisa', en: 'Difficult / nearly impossible', zh: '困难 / 几乎不可行' },
  'Hari yang sama': { id: 'Hari yang sama', en: 'Same day', zh: '当天' },
  Besok: { id: 'Besok', en: 'Next day', zh: '次日' },
  '2-3 hari': { id: '2-3 hari', en: '2-3 days', zh: '2-3 天' },
  'Lebih lama / inden': { id: 'Lebih lama / inden', en: 'Longer / backorder', zh: '更久 / 预订' },
  'Hampir tiap hari': { id: 'Hampir tiap hari', en: 'Almost daily', zh: '几乎每天' },
  Mingguan: { id: 'Mingguan', en: 'Weekly', zh: '每周' },
  Bulanan: { id: 'Bulanan', en: 'Monthly', zh: '每月' },
  'Hanya saat ada permintaan': { id: 'Hanya saat ada permintaan', en: 'Only when requested', zh: '有需求时才补货' },
  Kecil: { id: 'Kecil', en: 'Small', zh: '小' },
  Besar: { id: 'Besar', en: 'Large', zh: '大' },
  'CBD transfer dulu': { id: 'CBD transfer dulu', en: 'CBD / transfer first', zh: '先款后货' },
  'COD barang datang': { id: 'COD barang datang', en: 'COD on delivery', zh: '货到付款' },
  'Tempo 7 hari': { id: 'Tempo 7 hari', en: '7-day term', zh: '7 天账期' },
  'Tempo 14 hari': { id: 'Tempo 14 hari', en: '14-day term', zh: '14 天账期' },
  'Tempo 30 hari+': { id: 'Tempo 30 hari+', en: '30+ day term', zh: '30 天以上账期' },
  'Campur / konsinyasi': { id: 'Campur / konsinyasi', en: 'Mixed / consignment', zh: '混合 / 寄售' },
  'Tidak bersedia menjawab': { id: 'Tidak bersedia menjawab', en: 'Declined to answer', zh: '拒绝回答' },
  'Didatangi sales canvasser': { id: 'Didatangi sales canvasser', en: 'Visited by canvassing sales', zh: '销售拜访下单' },
  'Order WhatsApp': { id: 'Order WhatsApp', en: 'WhatsApp order', zh: 'WhatsApp 下单' },
  Telepon: { id: 'Telepon', en: 'Phone call', zh: '电话' },
  'Harga murah': { id: 'Harga murah', en: 'Low price', zh: '低价格' },
  'Margin besar': { id: 'Margin besar', en: 'High margin', zh: '高利润' },
  'Brand terkenal': { id: 'Brand terkenal', en: 'Well-known brand', zh: '知名品牌' },
  'Kualitas stabil': { id: 'Kualitas stabil', en: 'Stable quality', zh: '质量稳定' },
  'Barang lengkap': { id: 'Barang lengkap', en: 'Complete availability', zh: '货品齐全' },
  'Fast delivery': { id: 'Pengiriman cepat', en: 'Fast delivery', zh: '快速交付' },
  'Retur mudah': { id: 'Retur mudah', en: 'Easy returns', zh: '退货方便' },
  'Tempo pembayaran': { id: 'Tempo pembayaran', en: 'Payment terms', zh: '账期' },
  'Sangat harga': { id: 'Sangat sensitif harga', en: 'Highly price-sensitive', zh: '高度价格敏感' },
  'Harga & kualitas seimbang': { id: 'Harga & kualitas seimbang', en: 'Balanced price and quality', zh: '价格与质量平衡' },
  'Lebih cari merk terkenal': { id: 'Lebih cari merk terkenal', en: 'Prefers well-known brands', zh: '更偏好知名品牌' },
  'Sangat terbuka': { id: 'Sangat terbuka', en: 'Very open', zh: '非常开放' },
  'Bisa coba': { id: 'Bisa coba', en: 'Willing to try', zh: '愿意尝试' },
  'Hanya merk tertentu': { id: 'Hanya merk tertentu', en: 'Only specific brands', zh: '仅限特定品牌' },
  'Tidak suka coba baru': { id: 'Tidak suka coba baru', en: 'Does not like trying new options', zh: '不愿尝试新品' },
  'Harga lebih murah': { id: 'Harga lebih murah', en: 'Lower price', zh: '更低价格' },
  'Margin lebih besar': { id: 'Margin lebih besar', en: 'Higher margin', zh: '更高利润' },
  'Barang lebih lengkap': { id: 'Barang lebih lengkap', en: 'More complete assortment', zh: '产品更齐全' },
  'Tempo lebih enak': { id: 'Tempo lebih enak', en: 'Better payment terms', zh: '更好的账期' },
  'Retur lebih gampang': { id: 'Retur lebih gampang', en: 'Easier returns', zh: '退货更方便' },
  'Pengiriman cepat': { id: 'Pengiriman cepat', en: 'Fast delivery', zh: '快速交付' },
  'Mau dihubungi': { id: 'Mau dihubungi', en: 'Willing to be contacted', zh: '愿意被联系' },
  'Boleh kirim katalog/price list dulu': { id: 'Boleh kirim katalog/price list dulu', en: 'Send catalogue/price list first', zh: '可先发送目录/价格表' },
  'Perlu bicara owner': { id: 'Perlu bicara owner', en: 'Need to speak with owner', zh: '需先与店主沟通' },
  'Tidak tertarik saat ini': { id: 'Tidak tertarik saat ini', en: 'Not interested for now', zh: '目前不感兴趣' },
  'Toko melarang foto area dalam': { id: 'Toko melarang foto area dalam', en: 'Store does not allow interior photos', zh: '门店不允许拍摄内部' },
  'Owner/PIC menolak foto orang': { id: 'Owner/PIC menolak foto orang', en: 'Owner/PIC declined personal photo', zh: '店主/联系人拒绝人物照片' },
  'Toko sedang ramai': { id: 'Toko sedang ramai', en: 'Store was busy', zh: '门店较忙' },
  'Alasan keamanan/privasi': { id: 'Alasan keamanan/privasi', en: 'Security/privacy reason', zh: '安全/隐私原因' },
  'Hot Lead': { id: 'Hot Lead', en: 'Hot Lead', zh: '高意向线索' },
  'Qualified Lead': { id: 'Qualified Lead', en: 'Qualified Lead', zh: '合格线索' },
  'Strategic Lead': { id: 'Strategic Lead', en: 'Strategic Lead', zh: '战略线索' },
  'Normal Lead': { id: 'Normal Lead', en: 'Normal Lead', zh: '普通线索' },
  'Low Priority': { id: 'Prioritas Rendah', en: 'Low Priority', zh: '低优先级' },
  Good: { id: 'Baik', en: 'Good', zh: '良好' },
  Poor: { id: 'Buruk', en: 'Poor', zh: '较差' },
  Warning: { id: 'Peringatan', en: 'Warning', zh: '预警' },
  WAITING_VERIFICATION: { id: 'Menunggu Verifikasi', en: 'Waiting Verification', zh: '待审核' },
  WAITING_VERIFICATION_WARNING: { id: 'Menunggu Verifikasi Warning', en: 'Waiting Verification - Warning', zh: '待审核 - 预警' },
  VERIFIED_VALID: { id: 'Terverifikasi Valid', en: 'Verified Valid', zh: '已验证有效' },
  NEED_REVISION: { id: 'Perlu Revisi', en: 'Need Revision', zh: '需要修订' },
  REJECTED_INVALID: { id: 'Ditolak Invalid', en: 'Rejected Invalid', zh: '无效驳回' },
  MERGED_DUPLICATE: { id: 'Duplikat Digabung', en: 'Merged Duplicate', zh: '已合并重复' },
  'Polibeli Field Force': { id: 'Field Force Polibeli', en: 'Polibeli Field Force', zh: 'Polibeli 外勤团队' },
  Loading: { id: 'Memuat', en: 'Loading', zh: '加载中' },
  'Filter Data Campaign': { id: 'Filter Data Campaign', en: 'Campaign Data Filter', zh: '活动数据筛选' },
  'Jawa Tengah - Timur': { id: 'Jawa Tengah - Timur', en: 'Central Java - East', zh: '中爪哇 - 东部' },
  'Filter ini menyiapkan konteks dashboard aktif. Integrasi query database per halaman akan memakai scope yang sama pada tahap berikutnya.': {
    id: 'Filter ini menyiapkan konteks dashboard aktif. Integrasi query database per halaman akan memakai scope yang sama pada tahap berikutnya.',
    en: 'This filter prepares the active dashboard context. Page-level database query integration will use the same scope in the next phase.',
    zh: '此筛选器用于设置当前仪表盘上下文。下一阶段的页面级数据库查询将使用相同范围。',
  },
  'Apply Filter': { id: 'Terapkan Filter', en: 'Apply Filter', zh: '应用筛选' },
  'Mark All Read': { id: 'Tandai Semua Dibaca', en: 'Mark All Read', zh: '全部标记为已读' },
  'Campaign day 9/25': { id: 'Hari campaign 9/25', en: 'Campaign day 9/25', zh: '活动第 9/25 天' },
  Area: { id: 'Area', en: 'Area', zh: '区域' },
  Progress: { id: 'Progress', en: 'Progress', zh: '进度' },
  Verified: { id: 'Terverifikasi', en: 'Verified', zh: '已验证' },
  toko: { id: 'toko', en: 'stores', zh: '家门店' },
  stores: { id: 'toko', en: 'stores', zh: '家门店' },
  'Photo evidence complete': { id: 'Evidence foto lengkap', en: 'Photo evidence complete', zh: '照片证据完整' },
  'Memuat history submit dari database...': { id: 'Memuat history submit dari database...', en: 'Loading submission history from database...', zh: '正在从数据库加载提交历史...' },
  'Belum ada survey tersubmit di database.': { id: 'Belum ada survey tersubmit di database.', en: 'No submitted surveys in the database yet.', zh: '数据库中尚无已提交调研。' },
  High: { id: 'Tinggi', en: 'High', zh: '高' },
  Provinsi: { id: 'Provinsi', en: 'Province', zh: '省份' },
  'Kota/Kabupaten': { id: 'Kota/Kabupaten', en: 'City/Regency', zh: '城市/县' },
  Kecamatan: { id: 'Kecamatan', en: 'District', zh: '区县' },
  'Desa/Kelurahan': { id: 'Desa/Kelurahan', en: 'Village/Subdistrict', zh: '村/街道' },
  'Ubah city, manager, atau pencarian untuk melihat assignment lain.': {
    id: 'Ubah kota, manager, atau pencarian untuk melihat assignment lain.',
    en: 'Change city, manager, or search terms to view other assignments.',
    zh: '更改城市、经理或搜索条件以查看其他任务。',
  },
  'toko dikelompokkan per provinsi, kota, kecamatan, dan desa/kelurahan. Expand hanya area yang sedang dikerjakan.': {
    id: 'toko dikelompokkan per provinsi, kota, kecamatan, dan desa/kelurahan. Expand hanya area yang sedang dikerjakan.',
    en: 'stores are grouped by province, city, district, and village/subdistrict. Expand only the area currently being worked on.',
    zh: '门店按省、市、区县和村/街道分组。仅展开当前处理的区域。',
  },
  Action: { id: 'Aksi', en: 'Action', zh: '操作' },
  Reassign: { id: 'Reassign', en: 'Reassign', zh: '重新分配' },
  'Selected store': { id: 'Toko terpilih', en: 'Selected store', zh: '已选门店' },
  'Soft warning jika jarak dari target lebih dari 100 meter.': {
    id: 'Soft warning jika jarak dari target lebih dari 100 meter.',
    en: 'Soft warning if distance from target exceeds 100 meters.',
    zh: '若距离目标超过 100 米，将产生软预警。',
  },
  Latitude: { id: 'Latitude', en: 'Latitude', zh: '纬度' },
  Longitude: { id: 'Longitude', en: 'Longitude', zh: '经度' },
  Accuracy: { id: 'Akurasi', en: 'Accuracy', zh: '精度' },
  Distance: { id: 'Jarak', en: 'Distance', zh: '距离' },
  'Landmark / patokan': { id: 'Landmark / patokan', en: 'Landmark / reference point', zh: '地标 / 参照点' },
  'Q14. Purchasing Decision Maker': { id: 'Q14. Pengambil Keputusan Pembelian', en: 'Q14. Purchasing Decision Maker', zh: 'Q14. 采购决策人' },
  'Q15. Decision Maker Availability': { id: 'Q15. Ketersediaan Decision Maker', en: 'Q15. Decision Maker Availability', zh: 'Q15. 决策人可见性' },
  'Q17. Vehicle Specialization': { id: 'Q17. Spesialisasi Kendaraan', en: 'Q17. Vehicle Specialization', zh: 'Q17. 车型专长' },
  'Other brand / supplier brand manual': { id: 'Brand lain / brand supplier manual', en: 'Other brand / supplier brand manual', zh: '其他品牌 / 手动供应商品牌' },
  'Q23. Product Selling Segment': { id: 'Q23. Segmen Produk yang Dijual', en: 'Q23. Product Selling Segment', zh: 'Q23. 销售产品分层' },
  'Q26. Existing supplier name (optional)': { id: 'Q26. Nama supplier existing (opsional)', en: 'Q26. Existing supplier name (optional)', zh: 'Q26. 现有供应商名称（可选）' },
  'Q29. Return Ease': { id: 'Q29. Kemudahan Retur', en: 'Q29. Return Ease', zh: 'Q29. 退货便利度' },
  'Q30. Delivery Speed': { id: 'Q30. Kecepatan Pengiriman', en: 'Q30. Delivery Speed', zh: 'Q30. 交付速度' },
  'Q31. Restock Frequency': { id: 'Q31. Frekuensi Restock', en: 'Q31. Restock Frequency', zh: 'Q31. 补货频率' },
  'Q32. Average Purchase Size': { id: 'Q32. Rata-rata Ukuran Pembelian', en: 'Q32. Average Purchase Size', zh: 'Q32. 平均采购规模' },
  'Estimated Monthly Purchase Value': { id: 'Estimasi Nilai Pembelian Bulanan', en: 'Estimated Monthly Purchase Value', zh: '预估月采购额' },
  'Q33. Payment Method': { id: 'Q33. Metode Pembayaran', en: 'Q33. Payment Method', zh: 'Q33. 支付方式' },
  'Margin Expectation': { id: 'Ekspektasi Margin', en: 'Margin Expectation', zh: '利润期望' },
  'Current Order Method': { id: 'Metode Order Saat Ini', en: 'Current Order Method', zh: '当前下单方式' },
  'Q34. Main Purchase Driver': { id: 'Q34. Driver Utama Pembelian', en: 'Q34. Main Purchase Driver', zh: 'Q34. 主要采购驱动' },
  'Q38. Willingness to Receive Follow-up': { id: 'Q38. Kesediaan Menerima Follow-up', en: 'Q38. Willingness to Receive Follow-up', zh: 'Q38. 接受后续跟进意愿' },
  'Q39. Foto Tampak Depan Toko': { id: 'Q39. Foto Tampak Depan Toko', en: 'Q39. Storefront Photo', zh: 'Q39. 门头照片' },
  'Q40. Foto Dalam Toko / Rak': { id: 'Q40. Foto Dalam Toko / Rak', en: 'Q40. Interior / Rack Photo', zh: 'Q40. 店内 / 货架照片' },
  'Produk:': { id: 'Produk:', en: 'Products:', zh: '产品：' },
  Plan: { id: 'Plan', en: 'Plan', zh: '计划' },
  Draft: { id: 'Draft', en: 'Draft', zh: '草稿' },
  History: { id: 'Histori', en: 'History', zh: '历史' },
  'Load Draft': { id: 'Load Draft', en: 'Load Draft', zh: '加载草稿' },
  'History submit hari ini': { id: 'Histori submit hari ini', en: "Today's submission history", zh: '今日提交历史' },
  'Merchant Potential': { id: 'Potensi Merchant', en: 'Merchant Potential', zh: '商户潜力' },
  'Score akan muncul setelah survey berhasil disubmit dan dihitung oleh backend.': {
    id: 'Skor akan muncul setelah survey berhasil disubmit dan dihitung oleh backend.',
    en: 'Score will appear after the survey is submitted and calculated by the backend.',
    zh: '调研提交并由后端计算后将显示评分。',
  },
  'Pilih toko untuk mulai survey': { id: 'Pilih toko untuk mulai survey', en: 'Select a store to start the survey', zh: '选择门店开始调研' },
  'Klik salah satu nama toko di Today Plan. Form survey lengkap baru akan muncul setelah toko dipilih, supaya surveyor tidak mengisi data tanpa konteks toko.': {
    id: 'Klik salah satu nama toko di Today Plan. Form survei lengkap baru akan muncul setelah toko dipilih, supaya surveyor tidak mengisi data tanpa konteks toko.',
    en: 'Click a store name in Today Plan. The full survey form will appear after a store is selected, so the surveyor cannot fill data without store context.',
    zh: '请点击今日计划中的一个门店名称。选择门店后才会显示完整调研表单，避免调研员在没有门店上下文的情况下填写数据。',
  },
  'Nama toko baru': { id: 'Nama toko baru', en: 'New store name', zh: '新门店名称' },
  Merchant: { id: 'Merchant', en: 'Merchant', zh: '商户' },
  Driver: { id: 'Driver', en: 'Driver', zh: '驱动因素' },
  Score: { id: 'Skor', en: 'Score', zh: '评分' },
  '? Akses login user ini akan hilang dari database aplikasi.': {
    id: '? Akses login user ini akan hilang dari database aplikasi.',
    en: '? This user login access will be removed from the application database.',
    zh: '？该用户的登录权限将从应用数据库中移除。',
  },
  Survey: { id: 'Survey', en: 'Survey', zh: '调研' },
  'Survey Completed': { id: 'Survey Selesai', en: 'Survey Completed', zh: '调研已完成' },
  'Cooling Survey Form': { id: 'Form Survei Cooling', en: 'Cooling Survey Form', zh: '冷却产品调研表单' },
  'Cooling survey form': { id: 'Form survei cooling', en: 'Cooling survey form', zh: '冷却产品调研表单' },
  'Field survey form': { id: 'Form survei lapangan', en: 'Field survey form', zh: '外勤调研表单' },
  'Kembali ke Today Plan': { id: 'Kembali ke Today Plan', en: 'Back to Today Plan', zh: '返回今日计划' },
  'Back to Assigned Visits': { id: 'Kembali ke Kunjungan Terjadwal', en: 'Back to Assigned Visits', zh: '返回已分配拜访' },
  'Start Survey': { id: 'Survey Awal', en: 'Start Survey', zh: '调研开始' },
  'Address Survey': { id: 'Survey Alamat', en: 'Address Survey', zh: '地址调研' },
  'Contact Survey': { id: 'Survey Kontak', en: 'Contact Survey', zh: '联系方式调研' },
  'Business Survey': { id: 'Survey Bisnis', en: 'Business Survey', zh: '业务调研' },
  'Cooling Survey': { id: 'Survey Cooling', en: 'Cooling Survey', zh: '冷却产品调研' },
  'Supplier Survey': { id: 'Survey Supplier', en: 'Supplier Survey', zh: '供应商调研' },
  'Commercial Survey': { id: 'Survey Komersial', en: 'Commercial Survey', zh: '商业调研' },
  'Openness Survey': { id: 'Survey Keterbukaan', en: 'Openness Survey', zh: '开放度调研' },
  'Photos Survey': { id: 'Survey Foto', en: 'Photo Survey', zh: '照片采集' },
  'Review Survey': { id: 'Review Survey', en: 'Survey Review', zh: '调研复核' },
  '13 toko target': { id: '13 toko target', en: '13 target stores', zh: '13 家目标门店' },
  'General sparepart': { id: 'Sparepart umum', en: 'General spare parts', zh: '通用零部件' },
  'Cooling specialist': { id: 'Spesialis cooling', en: 'Cooling specialist', zh: '冷却产品专营' },
  'AC specialist': { id: 'Spesialis AC', en: 'AC specialist', zh: '空调专营' },
  'No GPS': { id: 'Belum ada GPS', en: 'No GPS', zh: '无 GPS' },
  Submitted: { id: 'Terkirim', en: 'Submitted', zh: '已提交' },
  'Wajib untuk Survey Completed': { id: 'Wajib untuk Survey Selesai', en: 'Required for completed surveys', zh: '完成调研必须上传' },
  'Boleh kosong dengan alasan': { id: 'Boleh kosong dengan alasan', en: 'Optional if a reason is provided', zh: '可为空，但需填写原因' },
  'Q41. Foto dengan Narasumber / PIC': { id: 'Q41. Foto dengan Narasumber / PIC', en: 'Q41. Photo with Respondent / PIC', zh: 'Q41. 与受访人 / 联系人合影' },
  'Q42. Surveyor notes': { id: 'Q42. Catatan Surveyor', en: 'Q42. Surveyor Notes', zh: 'Q42. 调研员备注' },
  Capture: { id: 'Ambil Foto', en: 'Capture', zh: '拍照' },
  'Foto kamera tersimpan di backend': { id: 'Foto kamera tersimpan di backend', en: 'Camera photo saved to the backend', zh: '相机照片已保存到后端' },
  'Evidence hanya bisa diambil dari kamera langsung untuk mengurangi risiko fraud dari galeri perangkat.': {
    id: 'Evidence hanya bisa diambil dari kamera langsung untuk mengurangi risiko fraud dari galeri perangkat.',
    en: 'Evidence must be captured directly from the device camera to reduce gallery-based fraud risk.',
    zh: '证据必须直接通过设备相机拍摄，以降低从相册上传造成的作弊风险。',
  },
  'Kamera perangkat tidak bisa diakses. Pastikan izin kamera aktif dan gunakan browser di localhost/HTTPS.': {
    id: 'Kamera perangkat tidak bisa diakses. Pastikan izin kamera aktif dan gunakan browser di localhost/HTTPS.',
    en: 'The device camera cannot be accessed. Make sure camera permission is enabled and use localhost or HTTPS.',
    zh: '无法访问设备相机。请确认已允许相机权限，并使用 localhost 或 HTTPS。',
  },
  'Kamera belum siap. Tunggu pratinjau muncul lalu coba lagi.': {
    id: 'Kamera belum siap. Tunggu pratinjau muncul lalu coba lagi.',
    en: 'The camera is not ready yet. Wait for the preview to appear, then try again.',
    zh: '相机尚未准备好。请等待预览画面出现后再重试。',
  },
  'Foto kamera gagal disimpan.': { id: 'Foto kamera gagal disimpan.', en: 'The camera photo could not be saved.', zh: '相机照片保存失败。' },
  Ganti: { id: 'Ganti', en: 'Replace', zh: '更换' },
  Hapus: { id: 'Hapus', en: 'Delete', zh: '删除' },
  'Store alias / nama papan toko': { id: 'Alias toko / nama papan toko', en: 'Store alias / signboard name', zh: '门店别名 / 招牌名称' },
  'GPS Auto Capture': { id: 'Auto Capture GPS', en: 'GPS Auto Capture', zh: 'GPS 自动采集' },
  'Capture GPS': { id: 'Capture GPS', en: 'Capture GPS', zh: '采集 GPS' },
  'Q1. Visit Outcome': { id: 'Q1. Hasil Kunjungan', en: 'Q1. Visit Outcome', zh: 'Q1. 拜访结果' },
  'Detailed Address': { id: 'Alamat Detail', en: 'Detailed Address', zh: '详细地址' },
  'Pilih alamat lengkap dari master lokasi Jawa': { id: 'Pilih alamat lengkap dari master lokasi Jawa', en: 'Select a complete address from the Java location master', zh: '请从爪哇区域主数据中选择完整地址' },
  'Alamat valid dari master lokasi Jawa': {
    id: 'Alamat valid dari master lokasi Jawa',
    en: 'Address is valid against the Java location master',
    zh: '地址已通过爪哇区域主数据校验',
  },
  'PIC / narasumber': { id: 'PIC / narasumber', en: 'PIC / respondent', zh: '联系人 / 受访人' },
  'Q11. PIC Type': { id: 'Q11. Tipe PIC', en: 'Q11. PIC Type', zh: 'Q11. 联系人类型' },
  'Q13. Reason if WhatsApp Empty': { id: 'Q13. Alasan Jika WhatsApp Kosong', en: 'Q13. Reason if WhatsApp is Empty', zh: 'Q13. WhatsApp 为空原因' },
  'Q16. Main Business Type': { id: 'Q16. Tipe Bisnis Utama', en: 'Q16. Main Business Type', zh: 'Q16. 主要业务类型' },
  'Q18. Store Scale Estimate': { id: 'Q18. Estimasi Skala Toko', en: 'Q18. Store Scale Estimate', zh: 'Q18. 门店规模估计' },
  'Q19. Cooling Products Seen / Sold': { id: 'Q19. Produk Cooling Terlihat / Dijual', en: 'Q19. Cooling Products Seen / Sold', zh: 'Q19. 看到 / 销售的冷却产品' },
  'Q20. Cooling Shelf / Stock Size': { id: 'Q20. Ukuran Rak / Stok Cooling', en: 'Q20. Cooling Shelf / Stock Size', zh: 'Q20. 冷却产品货架 / 库存规模' },
  'Q21. Cooling Sales Activity': { id: 'Q21. Aktivitas Penjualan Cooling', en: 'Q21. Cooling Sales Activity', zh: 'Q21. 冷却产品销售活跃度' },
  'Q22. Cooling Brands Seen / Sold': { id: 'Q22. Brand Cooling Terlihat / Dijual', en: 'Q22. Cooling Brands Seen / Sold', zh: 'Q22. 看到 / 销售的冷却品牌' },
  'Q24. Low Cost Import Share': { id: 'Q24. Share Import Low Cost', en: 'Q24. Low-Cost Import Share', zh: 'Q24. 低价进口占比' },
  'Q25. Supplier Type': { id: 'Q25. Tipe Supplier', en: 'Q25. Supplier Type', zh: 'Q25. 供应商类型' },
  'Q27. Supplier Dependency': { id: 'Q27. Ketergantungan Supplier', en: 'Q27. Supplier Dependency', zh: 'Q27. 供应商依赖度' },
  'Q28. Supplier Satisfaction': { id: 'Q28. Kepuasan Supplier', en: 'Q28. Supplier Satisfaction', zh: 'Q28. 供应商满意度' },
  'Q35. Store Price Sensitivity': { id: 'Q35. Sensitivitas Harga Toko', en: 'Q35. Store Price Sensitivity', zh: 'Q35. 门店价格敏感度' },
  'Q36. Openness to New Alternative Brand': { id: 'Q36. Keterbukaan terhadap Brand Alternatif Baru', en: 'Q36. Openness to New Alternative Brand', zh: 'Q36. 对新替代品牌的开放度' },
  'Q37. Main Reason to Try New Supplier': { id: 'Q37. Alasan Utama Mencoba Supplier Baru', en: 'Q37. Main Reason to Try New Supplier', zh: 'Q37. 尝试新供应商的主要原因' },
  'Review sebelum submit': { id: 'Review sebelum submit', en: 'Review before submission', zh: '提交前复核' },
  'Draft tersedia': { id: 'Draft tersedia', en: 'Draft available', zh: '草稿可用' },
  'Belum ada draft tersimpan': { id: 'Belum ada draft tersimpan', en: 'No saved draft yet', zh: '暂无已保存草稿' },
  'Belum ada survey yang disubmit pada sesi ini.': { id: 'Belum ada survey yang disubmit pada sesi ini.', en: 'No survey has been submitted in this session.', zh: '本会话尚未提交调研。' },
  'sudah masuk queue verifikasi.': { id: 'sudah masuk antrean verifikasi.', en: 'has entered the verification queue.', zh: '已进入审核队列。' },
  'tersimpan lokal pada': { id: 'tersimpan lokal pada', en: 'was saved locally at', zh: '已本地保存于' },
  'Draft lokal tidak bisa dibaca.': { id: 'Draft lokal tidak bisa dibaca.', en: 'Local draft cannot be read.', zh: '无法读取本地草稿。' },
  'Belum ada draft lokal untuk dimuat.': { id: 'Belum ada draft lokal untuk dimuat.', en: 'No local draft is available to load.', zh: '没有可加载的本地草稿。' },
  'berhasil dimuat.': { id: 'berhasil dimuat.', en: 'loaded successfully.', zh: '已成功加载。' },
  'masuk queue verifikasi.': { id: 'masuk antrean verifikasi.', en: 'entered the verification queue.', zh: '已进入审核队列。' },
  'Submit gagal': { id: 'Submit gagal', en: 'Submit failed', zh: '提交失败' },
  'Draft disimpan lokal.': { id: 'Draft disimpan lokal.', en: 'Draft saved locally.', zh: '草稿已本地保存。' },
  'Jika foto dalam/rak kosong, pilih alasan refusal.': {
    id: 'Jika foto dalam/rak kosong, pilih alasan refusal.',
    en: 'If the interior/rack photo is missing, select the refusal reason.',
    zh: '如果缺少店内/货架照片，请选择拒拍原因。',
  },
  'Foto dalam/rak kosong: akan masuk queue warning verificator.': {
    id: 'Foto dalam/rak kosong: akan masuk queue warning verificator.',
    en: 'Missing interior/rack photo: this will enter the verifier warning queue.',
    zh: '缺少店内/货架照片：将进入审核员预警队列。',
  },
  'GPS berhasil dicapture.': { id: 'GPS berhasil dicapture.', en: 'GPS captured successfully.', zh: 'GPS 采集成功。' },
  'Bapak/Ibu': { id: 'Bapak/Ibu', en: 'Sir/Madam', zh: '先生/女士' },
  '< Rp1 juta / bulan': { id: '< Rp1 juta/bulan', en: '< Rp1 million/month', zh: '每月 < Rp100万' },
  'Rp1-5 juta / bulan': { id: 'Rp1-5 juta/bulan', en: 'Rp1-5 million/month', zh: '每月 Rp100万-500万' },
  'Rp5-10 juta / bulan': { id: 'Rp5-10 juta/bulan', en: 'Rp5-10 million/month', zh: '每月 Rp500万-1,000万' },
  'Rp10-25 juta / bulan': { id: 'Rp10-25 juta/bulan', en: 'Rp10-25 million/month', zh: '每月 Rp1,000万-2,500万' },
  '> Rp25 juta / bulan': { id: '> Rp25 juta/bulan', en: '> Rp25 million/month', zh: '每月 > Rp2,500万' },
  '< 10%': { id: '< 10%', en: '< 10%', zh: '< 10%' },
  '10-15%': { id: '10-15%', en: '10-15%', zh: '10-15%' },
  '16-25%': { id: '16-25%', en: '16-25%', zh: '16-25%' },
  '> 25%': { id: '> 25%', en: '> 25%', zh: '> 25%' },
  'Maksimal 3 pilihan.': { id: 'Maksimal 3 pilihan.', en: 'Maximum 3 choices.', zh: '最多选择 3 项。' },
  'Maksimal 2 pilihan.': { id: 'Maksimal 2 pilihan.', en: 'Maximum 2 choices.', zh: '最多选择 2 项。' },
  'Maksimal 1 pilihan.': { id: 'Maksimal 1 pilihan.', en: 'Maximum 1 choice.', zh: '最多选择 1 项。' },
  'Japanese Passenger Car': { id: 'Mobil penumpang Jepang', en: 'Japanese passenger car', zh: '日系乘用车' },
  'European Passenger Car': { id: 'Mobil penumpang Eropa', en: 'European passenger car', zh: '欧系乘用车' },
  'Korean Passenger Car': { id: 'Mobil penumpang Korea', en: 'Korean passenger car', zh: '韩系乘用车' },
  'Chinese Car': { id: 'Mobil merek China', en: 'Chinese-brand car', zh: '中国品牌车型' },
  'SUV/4x4': { id: 'SUV/4x4', en: 'SUV/4x4', zh: 'SUV/四驱车' },
  'Commercial Van/Pickup': { id: 'Van/Pickup komersial', en: 'Commercial van/pickup', zh: '商用厢式车/皮卡' },
  'Diesel/Truck': { id: 'Diesel/Truk', en: 'Diesel/truck', zh: '柴油车/卡车' },
  'Universal Mixed': { id: 'Campuran universal', en: 'Universal mixed', zh: '综合车型' },
  'Generic China': { id: 'Generic China', en: 'Generic China', zh: '中国通用品牌' },
  'Local No Brand': { id: 'Lokal tanpa brand', en: 'Local no-brand', zh: '本地无品牌' },
  'Local no brand': { id: 'Lokal tanpa brand', en: 'Local no-brand', zh: '本地无品牌' },
  Qualified: { id: 'Qualified', en: 'Qualified', zh: '合格' },
  Strategic: { id: 'Strategic', en: 'Strategic', zh: '战略' },
  'Kualitas lebih stabil': { id: 'Kualitas lebih stabil', en: 'More stable quality', zh: '质量更稳定' },
  'Tidak tertarik': { id: 'Tidak tertarik', en: 'Not interested', zh: '不感兴趣' },
  'Scope area': { id: 'Scope area', en: 'Scope area', zh: '范围区域' },
  'Supplier Signals': { id: 'Sinyal Supplier', en: 'Supplier Signals', zh: '供应商信号' },
  'Submitted History': { id: 'Histori Submit', en: 'Submitted History', zh: '提交历史' },
  'Score After Submit': { id: 'Skor Setelah Submit', en: 'Score After Submit', zh: '提交后评分' },
  'Submission Result': { id: 'Hasil Pengiriman', en: 'Submission Result', zh: '提交结果' },
  'Data Quality': { id: 'Kualitas Data', en: 'Data Quality', zh: '数据质量' },
  'Cooling Products': { id: 'Produk Cooling', en: 'Cooling Products', zh: '冷却产品' },
  'Business Type': { id: 'Tipe Bisnis', en: 'Business Type', zh: '业务类型' },
  'Download XLSX': { id: 'Download XLSX', en: 'Download XLSX', zh: '下载 XLSX' },
  'Supplier:': { id: 'Supplier:', en: 'Supplier:', zh: '供应商：' },
  'History survey dari database belum bisa dimuat.': {
    id: 'Histori survei dari database belum bisa dimuat.',
    en: 'Survey history from the database could not be loaded.',
    zh: '无法加载数据库中的调研历史。',
  },
  'Export Surveyor Progress dibuat dalam format XLSX.': {
    id: 'Export progress surveyor dibuat dalam format XLSX.',
    en: 'Surveyor progress export was created in XLSX format.',
    zh: '调研员进度导出已生成为 XLSX 格式。',
  },
  'History submit toko dibuat dalam format XLSX.': {
    id: 'Histori submit toko dibuat dalam format XLSX.',
    en: 'Store submission history was created in XLSX format.',
    zh: '门店提交历史已生成为 XLSX 格式。',
  },
  'Manager belum terisi': { id: 'Manager belum terisi', en: 'Manager is not assigned', zh: '尚未分配经理' },
  'Data akan muncul setelah surveyor submit dari Surveyor PWA.': {
    id: 'Data akan muncul setelah surveyor submit dari PWA Surveyor.',
    en: 'Data will appear after the surveyor submits from the Surveyor PWA.',
    zh: '调研员通过调研员 PWA 提交后，数据将在此显示。',
  },
  'Data akan muncul setelah surveyor mengirim laporan dari Ruang Kerja Surveyor.': {
    id: 'Data akan muncul setelah surveyor mengirim laporan dari Ruang Kerja Surveyor.',
    en: 'Data will appear after surveyors submit reports from the Field Survey Workspace.',
    zh: '调研员从外勤调研工作台提交报告后，数据将在此显示。',
  },
  'Pilih alamat lengkap dari master lokasi': {
    id: 'Pilih alamat lengkap dari master lokasi',
    en: 'Select a complete address from the location master',
    zh: '请从区域主数据中选择完整地址',
  },
  'Alamat target valid dari master lokasi Jawa': {
    id: 'Alamat target valid dari master lokasi Jawa',
    en: 'Target address is valid against the Java location master',
    zh: '目标地址已通过爪哇区域主数据校验',
  },
  'Kombinasi alamat tidak ditemukan di master lokasi': {
    id: 'Kombinasi alamat tidak ditemukan di master lokasi',
    en: 'Address combination was not found in the location master',
    zh: '区域主数据中未找到该地址组合',
  },
  'Save Reassign': { id: 'Simpan Reassign', en: 'Save Reassign', zh: '保存重新分配' },
  'Tidak ada toko sesuai filter.': { id: 'Tidak ada toko sesuai filter.', en: 'No stores match the filter.', zh: '没有符合筛选条件的门店。' },
  'Ganti Surveyor': { id: 'Ganti Surveyor', en: 'Change Surveyor', zh: '更换调研员' },
  'Pilih toko dari Today Plan terlebih dahulu.': {
    id: 'Pilih toko dari Today Plan terlebih dahulu.',
    en: 'Select a store from Today Plan first.',
    zh: '请先从今日计划中选择门店。',
  },
  'Pilih kunjungan dari daftar terjadwal terlebih dahulu.': {
    id: 'Pilih kunjungan dari daftar terjadwal terlebih dahulu.',
    en: 'Select a visit from the assigned list first.',
    zh: '请先从已分配列表中选择拜访。',
  },
  'Minimal pilih satu produk cooling.': { id: 'Minimal pilih satu produk cooling.', en: 'Select at least one cooling product.', zh: '请至少选择一个冷却产品。' },
  'Minimal pilih satu spesialisasi kendaraan.': {
    id: 'Minimal pilih satu spesialisasi kendaraan.',
    en: 'Select at least one vehicle specialization.',
    zh: '请至少选择一个车型专长。',
  },
  'Minimal pilih satu purchase driver.': {
    id: 'Minimal pilih satu driver pembelian.',
    en: 'Select at least one purchase driver.',
    zh: '请至少选择一个采购驱动因素。',
  },
  'Minimal pilih satu alasan mencoba supplier baru.': {
    id: 'Minimal pilih satu alasan mencoba supplier baru.',
    en: 'Select at least one reason to try a new supplier.',
    zh: '请至少选择一个尝试新供应商的原因。',
  },
  'Jika foto PIC kosong, pilih alasan refusal.': {
    id: 'Jika foto PIC kosong, pilih alasan refusal.',
    en: 'If the PIC photo is missing, select the refusal reason.',
    zh: '如果缺少联系人照片，请选择拒拍原因。',
  },
  'GPS warning: jarak submit lebih dari 100 meter dari target.': {
    id: 'Peringatan GPS: jarak submit lebih dari 100 meter dari target.',
    en: 'GPS warning: submitted location is more than 100 meters from the target.',
    zh: 'GPS 预警：提交位置距离目标超过 100 米。',
  },
  'WA kosong: toko tidak bisa menjadi Hot Lead, tetapi masih bisa Qualified Lead.': {
    id: 'WA kosong: toko tidak bisa menjadi Hot Lead, tetapi masih bisa Qualified Lead.',
    en: 'WA is missing: the store cannot become a Hot Lead, but can still become a Qualified Lead.',
    zh: '缺少 WhatsApp：该门店不能成为高意向线索，但仍可成为合格线索。',
  },
  'Foto dengan PIC kosong: perlu alasan agar submit tetap boleh.': {
    id: 'Foto dengan PIC kosong: perlu alasan agar submit tetap boleh.',
    en: 'PIC photo is missing: a reason is required before submission is allowed.',
    zh: '缺少联系人照片：需要填写原因后才能提交。',
  },
  'Tidak bersedia': { id: 'Tidak bersedia', en: 'Not willing', zh: '不愿意' },
  'Banyak jawaban tidak tahu/tidak bersedia: Data Quality Score bisa turun.': {
    id: 'Banyak jawaban tidak tahu/tidak bersedia: skor kualitas data bisa turun.',
    en: 'Many unknown/not-willing answers may reduce the data quality score.',
    zh: '较多“不知道/不愿意”回答可能降低数据质量评分。',
  },
  'Unplanned Area': { id: 'Area Unplanned', en: 'Unplanned Area', zh: '计划外区域' },
  'Unplanned store': { id: 'Toko unplanned', en: 'Unplanned store', zh: '计划外门店' },
  'offline queue': { id: 'antrean offline', en: 'offline queue', zh: '离线队列' },
  'Toko Perlu Revisi': { id: 'Toko Perlu Revisi', en: 'Stores Needing Revision', zh: '需要修订的门店' },
  'Toko yang dikembalikan verificator dan harus diperbaiki surveyor.': {
    id: 'Toko yang dikembalikan verificator dan harus diperbaiki surveyor.',
    en: 'Stores returned by the verifier and requiring surveyor correction.',
    zh: '由审核员退回、需要调研员修订的门店。',
  },
  'Reports returned by verification and waiting for surveyor correction.': {
    id: 'Laporan yang dikembalikan verifikasi dan menunggu perbaikan surveyor.',
    en: 'Reports returned by verification and waiting for surveyor correction.',
    zh: '审核退回并等待调研员修正的报告。',
  },
  'Tidak ada toko yang perlu direvisi.': {
    id: 'Tidak ada toko yang perlu direvisi.',
    en: 'No stores need revision.',
    zh: '暂无需要修订的门店。',
  },
  'Tidak ada laporan yang perlu direvisi.': {
    id: 'Tidak ada laporan yang perlu direvisi.',
    en: 'No reports need revision.',
    zh: '暂无需要修订的报告。',
  },
  'Buka Revisi': { id: 'Buka Revisi', en: 'Open Revision', zh: '打开修订' },
  'Continue Revision': { id: 'Lanjutkan Revisi', en: 'Continue Revision', zh: '继续修订' },
  'Catatan revisi': { id: 'Catatan revisi', en: 'Revision notes', zh: '修订备注' },
  'Belum ada instruksi revisi dari verificator.': {
    id: 'Belum ada instruksi revisi dari verificator.',
    en: 'No revision instructions from the verifier yet.',
    zh: '审核员尚未填写修订说明。',
  },
  'Survey Terkirim': { id: 'Survey Terkirim', en: 'Submitted Surveys', zh: '已提交调研' },
  'Dikelompokkan per tanggal dan status verifikasi.': {
    id: 'Dikelompokkan per tanggal dan status verifikasi.',
    en: 'Grouped by date and verification status.',
    zh: '按日期和审核状态分组。',
  },
  'Belum ada survey terkirim.': { id: 'Belum ada survey terkirim.', en: 'No surveys have been submitted yet.', zh: '暂无已提交调研。' },
  'Belum ada laporan terkirim.': { id: 'Belum ada laporan terkirim.', en: 'No reports have been submitted yet.', zh: '暂无已提交报告。' },
  'Status verifikasi': { id: 'Status verifikasi', en: 'Verification status', zh: '审核状态' },
  'Skor merchant': { id: 'Skor merchant', en: 'Merchant score', zh: '商户评分' },
  'Kualitas data': { id: 'Kualitas data', en: 'Data quality', zh: '数据质量' },
  'Lihat Detail': { id: 'Lihat Detail', en: 'View Detail', zh: '查看详情' },
  'View Report': { id: 'Lihat Laporan', en: 'View Report', zh: '查看报告' },
  'Dibuka untuk revisi.': { id: 'Dibuka untuk revisi.', en: 'Opened for revision.', zh: '已打开用于修订。' },
  'Detail survey dibuka.': { id: 'Detail survey dibuka.', en: 'Survey detail opened.', zh: '已打开调研详情。' },
  'Submit gagal. Draft disimpan lokal.': {
    id: 'Submit gagal. Draft disimpan lokal.',
    en: 'Submission failed. Draft saved locally.',
    zh: '提交失败。草稿已保存到本地。',
  },
  'Cooling Specialist': { id: 'Spesialis Cooling', en: 'Cooling Specialist', zh: '冷却产品专营' },
  'General Sparepart': { id: 'Sparepart Umum', en: 'General Spare Parts', zh: '通用零部件' },
  'AC Specialist': { id: 'Spesialis AC', en: 'AC Specialist', zh: '空调专营' },
  'Local distributor': { id: 'Distributor lokal', en: 'Local distributor', zh: '本地分销商' },
  Canvasser: { id: 'Canvasser', en: 'Canvasser', zh: '外勤销售' },
  'Hot Leads': { id: 'Hot Lead', en: 'Hot Leads', zh: '高意向线索' },
  'Hot Lead export dibuat dalam format XLSX.': {
    id: 'Export Hot Lead dibuat dalam format XLSX.',
    en: 'Hot Lead export was created in XLSX format.',
    zh: '高意向线索导出已生成为 XLSX 格式。',
  },
  'GPS >100m': { id: 'GPS >100m', en: 'GPS >100m', zh: 'GPS 超过 100 米' },
  'Missing PIC photo': { id: 'Foto PIC belum ada', en: 'Missing PIC photo', zh: '缺少联系人照片' },
  'Possible duplicate': { id: 'Kemungkinan duplikat', en: 'Possible duplicate', zh: '可能重复' },
  'Need owner': { id: 'Butuh owner', en: 'Need owner', zh: '需要店主确认' },
  'Unplanned candidate': { id: 'Kandidat unplanned', en: 'Unplanned candidate', zh: '计划外候选' },
  'Cooling Brands Seen': { id: 'Brand Cooling Terlihat', en: 'Cooling Brands Seen', zh: '看到的冷却品牌' },
  'Hot Lead Export Preview': { id: 'Preview Export Hot Lead', en: 'Hot Lead Export Preview', zh: '高意向线索导出预览' },
  'Export Job': { id: 'Job Export', en: 'Export Job', zh: '导出任务' },
  'Failed to load users': { id: 'Pengguna gagal dimuat', en: 'Failed to load users', zh: '用户加载失败' },
  'Failed to save user': { id: 'Pengguna gagal disimpan', en: 'Failed to save user', zh: '用户保存失败' },
  'Failed to update status': { id: 'Status gagal diperbarui', en: 'Failed to update status', zh: '状态更新失败' },
  'Failed to delete user': { id: 'Pengguna gagal dihapus', en: 'Failed to delete user', zh: '用户删除失败' },
  'National dashboard, intelligence, performance, export final.': {
    id: 'Dashboard nasional, intelijen, performa, export final.',
    en: 'National dashboard, intelligence, performance, and final exports.',
    zh: '全国仪表盘、情报、绩效与最终导出。',
  },
  'Area assignment, H-1 visit plan, team progress, hot lead area.': {
    id: 'Assignment area, rencana kunjungan H-1, progress tim, area hot lead.',
    en: 'Area assignments, H-1 visit plan, team progress, and area hot leads.',
    zh: '区域任务分配、H-1 拜访计划、团队进度与区域高意向线索。',
  },
  'Filter campaign diterapkan untuk sesi tampilan ini.': {
    id: 'Filter campaign diterapkan untuk sesi tampilan ini.',
    en: 'Campaign filter applied for this view session.',
    zh: '活动筛选已应用于当前视图会话。',
  },
  'Semua notifikasi ditandai sudah dibaca.': {
    id: 'Semua notifikasi ditandai sudah dibaca.',
    en: 'All notifications marked as read.',
    zh: '所有通知已标记为已读。',
  },
  'Cooling parts': { id: 'Cooling parts', en: 'Cooling parts', zh: '冷却零部件' },
  'Lead priority': { id: 'Prioritas lead', en: 'Lead priority', zh: '线索优先级' },
  'Lead Mix': { id: 'Komposisi Lead', en: 'Lead Mix', zh: '线索组合' },
  'Lead Type': { id: 'Tipe Lead', en: 'Lead Type', zh: '线索类型' },
  Hot: { id: 'Hot', en: 'Hot', zh: '高意向' },
  Low: { id: 'Rendah', en: 'Low', zh: '低' },
  OK: { id: 'OK', en: 'OK', zh: '正常' },
  'Reject Invalid': { id: 'Tolak Invalid', en: 'Reject Invalid', zh: '驳回无效' },
};

const additionalI18nPhrases: Record<string, Record<AppLanguage, string>> = {
  'Open navigation': { id: 'Buka navigasi', en: 'Open navigation', zh: '打开导航' },
  'Filter data': { id: 'Filter data', en: 'Filter data', zh: '筛选数据' },
  Notifications: { id: 'Notifikasi', en: 'Notifications', zh: '通知' },
  Logout: { id: 'Keluar', en: 'Sign out', zh: '退出' },
  'KLWT field force': { id: 'Field force KLWT', en: 'KLWT field force', zh: 'KLWT 外勤团队' },
  'KLWT Cooling Merchant Penetration Intelligence Platform': {
    id: 'Platform Intelijen Penetrasi Merchant Cooling KLWT',
    en: 'KLWT Cooling Merchant Penetration Intelligence Platform',
    zh: 'KLWT 冷却品类商户渗透智能平台',
  },
  'Offline-lite ready': { id: 'Offline-lite siap', en: 'Offline-lite ready', zh: '轻量离线已就绪' },
  'Draft local, sync pending, retry submit': {
    id: 'Draft lokal, sinkronisasi tertunda, submit bisa dicoba ulang',
    en: 'Local drafts, pending sync, retryable submission',
    zh: '本地草稿、待同步、可重试提交',
  },
  'Active role:': { id: 'Role aktif:', en: 'Active role:', zh: '当前角色：' },
  'Executive performance, market intelligence, and final export governance.': {
    id: 'Kinerja eksekutif, intelijen pasar, dan tata kelola export final.',
    en: 'Executive performance, market intelligence, and final export governance.',
    zh: '高层绩效、市场情报和最终导出治理。',
  },
  'Visit routing, target store pool, and assignment readiness.': {
    id: 'Rute kunjungan, pool toko target, dan kesiapan assignment.',
    en: 'Visit routing, target store pool, and assignment readiness.',
    zh: '拜访路线、目标门店池和任务准备情况。',
  },
  'Assigned visits, manual additions, drafts, submitted reports, and submission results.': {
    id: 'Kunjungan terjadwal, input manual, draft, laporan terkirim, dan hasil submit.',
    en: 'Assigned visits, manual additions, drafts, submitted reports, and submission results.',
    zh: '已分配拜访、手动新增、草稿、已提交报告和提交结果。',
  },
  'Verification queue, evidence review, GPS validation, and duplicate decisions.': {
    id: 'Antrean verifikasi, review evidence, validasi GPS, dan keputusan duplikat.',
    en: 'Verification queue, evidence review, GPS validation, and duplicate decisions.',
    zh: '审核队列、证据复核、GPS 校验和重复判定。',
  },
  'Master data, territory, survey options, scoring, and export controls.': {
    id: 'Master data, teritori, opsi survey, scoring, dan kontrol export.',
    en: 'Master data, territory, survey options, scoring, and export controls.',
    zh: '主数据、区域、调研选项、评分和导出控制。',
  },
  'Sync healthy': { id: 'Sinkronisasi sehat', en: 'Sync healthy', zh: '同步正常' },
  'Campaign day': { id: 'Hari campaign', en: 'Campaign day', zh: '活动天数' },
  'Scope area': { id: 'Scope area', en: 'Scope area', zh: '区域范围' },
  'Pilih scope area': { id: 'Pilih scope area', en: 'Select area scope', zh: '选择区域范围' },
  'All Java': { id: 'Seluruh Jawa', en: 'All Java', zh: '整个爪哇' },
  'All leads': { id: 'Semua lead', en: 'All leads', zh: '全部线索' },
  'Warning data': { id: 'Data peringatan', en: 'Warning data', zh: '预警数据' },
  unread: { id: 'belum dibaca', en: 'unread', zh: '未读' },
  Read: { id: 'Dibaca', en: 'Read', zh: '已读' },
  Unread: { id: 'Belum dibaca', en: 'Unread', zh: '未读' },
  'Push perangkat': { id: 'Push perangkat', en: 'Device push', zh: '设备推送' },
  'Push notification perangkat': { id: 'Push notification perangkat', en: 'Device push notification', zh: '设备推送通知' },
  'Browser tidak mendukung Web Push.': { id: 'Browser tidak mendukung Web Push.', en: 'This browser does not support Web Push.', zh: '此浏览器不支持 Web Push。' },
  'Browser perangkat ini belum mendukung Web Push.': {
    id: 'Browser perangkat ini belum mendukung Web Push.',
    en: 'This device browser does not support Web Push.',
    zh: '此设备浏览器尚不支持 Web Push。',
  },
  'Status push perangkat gagal dimuat.': { id: 'Status push perangkat gagal dimuat.', en: 'Device push status failed to load.', zh: '设备推送状态加载失败。' },
  'Web Push backend belum aktif.': { id: 'Backend Web Push belum aktif.', en: 'Web Push backend is not active yet.', zh: 'Web Push 后端尚未启用。' },
  'Public key Web Push belum tersedia.': { id: 'Public key Web Push belum tersedia.', en: 'Web Push public key is not available yet.', zh: 'Web Push 公钥尚不可用。' },
  'Izin notifikasi perangkat belum diberikan.': { id: 'Izin notifikasi perangkat belum diberikan.', en: 'Device notification permission has not been granted.', zh: '尚未授予设备通知权限。' },
  'Push notification aktif di perangkat ini.': { id: 'Push notification aktif di perangkat ini.', en: 'Push notifications are active on this device.', zh: '此设备已启用推送通知。' },
  'Push notification gagal diaktifkan.': { id: 'Push notification gagal diaktifkan.', en: 'Failed to enable push notifications.', zh: '启用推送通知失败。' },
  'Push notification perangkat dinonaktifkan.': { id: 'Push notification perangkat dinonaktifkan.', en: 'Device push notifications have been disabled.', zh: '设备推送通知已禁用。' },
  'Push notification gagal dinonaktifkan.': { id: 'Push notification gagal dinonaktifkan.', en: 'Failed to disable push notifications.', zh: '禁用推送通知失败。' },
  'Notifikasi gagal dimuat.': { id: 'Notifikasi gagal dimuat.', en: 'Notifications failed to load.', zh: '通知加载失败。' },
  'Notifikasi gagal ditandai dibaca.': { id: 'Notifikasi gagal ditandai dibaca.', en: 'Failed to mark notification as read.', zh: '标记通知已读失败。' },
  'Tidak ada notifikasi untuk akun ini.': { id: 'Tidak ada notifikasi untuk akun ini.', en: 'There are no notifications for this account.', zh: '此账号暂无通知。' },
  Memuat: { id: 'Memuat', en: 'Loading', zh: '加载中' },
  'Tidak didukung': { id: 'Tidak didukung', en: 'Not supported', zh: '不支持' },
  Aktif: { id: 'Aktif', en: 'Active', zh: '启用' },
  Diblokir: { id: 'Diblokir', en: 'Blocked', zh: '已阻止' },
  'Backend nonaktif': { id: 'Backend nonaktif', en: 'Backend inactive', zh: '后端未启用' },
  Nonaktif: { id: 'Nonaktif', en: 'Inactive', zh: '未启用' },
  'Aktif di perangkat ini': { id: 'Aktif di perangkat ini', en: 'Active on this device', zh: '此设备已启用' },
  'Izin perangkat diblokir': { id: 'Izin perangkat diblokir', en: 'Device permission is blocked', zh: '设备权限已阻止' },
  'Nonaktif di perangkat ini': { id: 'Nonaktif di perangkat ini', en: 'Inactive on this device', zh: '此设备未启用' },
  'Close photo preview': { id: 'Tutup preview foto', en: 'Close photo preview', zh: '关闭照片预览' },
  'Zoom out photo': { id: 'Perkecil foto', en: 'Zoom out photo', zh: '缩小照片' },
  'Reset photo zoom': { id: 'Reset zoom foto', en: 'Reset photo zoom', zh: '重置照片缩放' },
  'Zoom in photo': { id: 'Perbesar foto', en: 'Zoom in photo', zh: '放大照片' },
  'Tutup Detail': { id: 'Tutup Detail', en: 'Close Detail', zh: '关闭详情' },
  'Kembali ke Progress Surveyor': { id: 'Kembali ke Progress Surveyor', en: 'Back to Surveyor Progress', zh: '返回调研员进度' },
  'Buka Google Maps': { id: 'Buka Google Maps', en: 'Open Google Maps', zh: '打开 Google 地图' },
  'Kirim WhatsApp': { id: 'Kirim WhatsApp', en: 'Send WhatsApp', zh: '发送 WhatsApp' },
  'Telepon Customer': { id: 'Telepon Pelanggan', en: 'Call Customer', zh: '拨打客户电话' },
  'Detail Survey': { id: 'Detail Survey', en: 'Survey Detail', zh: '调研详情' },
  'Dijalankan oleh': { id: 'Dijalankan oleh', en: 'Conducted by', zh: '执行人' },
  'Ringkasan Survey': { id: 'Ringkasan Survey', en: 'Survey Summary', zh: '调研摘要' },
  'Status verifikasi': { id: 'Status verifikasi', en: 'Verification status', zh: '审核状态' },
  'Detail Lokasi': { id: 'Detail Lokasi', en: 'Location Details', zh: '位置详情' },
  Province: { id: 'Provinsi', en: 'Province', zh: '省份' },
  City: { id: 'Kota/Kabupaten', en: 'City/Regency', zh: '城市/县' },
  'Detailed Address': { id: 'Alamat lengkap', en: 'Detailed Address', zh: '详细地址' },
  'Kontak & Bisnis': { id: 'Kontak & Bisnis', en: 'Contact & Business', zh: '联系与业务' },
  'PIC Type': { id: 'Tipe PIC', en: 'PIC Type', zh: '联系人类型' },
  'Bisa ditelepon': { id: 'Bisa ditelepon', en: 'Callable by phone', zh: '可电话联系' },
  'Bisa dihubungi WhatsApp': { id: 'Bisa dihubungi WhatsApp', en: 'Reachable via WhatsApp', zh: '可通过 WhatsApp 联系' },
  'Ya, sudah dicek': { id: 'Ya, sudah dicek', en: 'Yes, verified', zh: '是，已核实' },
  'Tidak bisa ditelepon': { id: 'Tidak bisa ditelepon', en: 'Cannot be called', zh: '无法电话联系' },
  'Tidak reachable': { id: 'Tidak reachable', en: 'Not reachable', zh: '无法联系' },
  'Kontak dicek': { id: 'Kontak dicek', en: 'Contact checked', zh: '联系方式已检查' },
  'Belum dicek': { id: 'Belum dicek', en: 'Not checked yet', zh: '尚未检查' },
  'Purchasing Decision Maker': { id: 'Pengambil keputusan pembelian', en: 'Purchasing decision maker', zh: '采购决策人' },
  'Decision Maker Availability': { id: 'Ketersediaan pengambil keputusan', en: 'Decision maker availability', zh: '决策人可用性' },
  'Main Business Type': { id: 'Tipe bisnis utama', en: 'Main business type', zh: '主营业务类型' },
  'Vehicle Specialization': { id: 'Spesialisasi kendaraan', en: 'Vehicle specialization', zh: '车型专长' },
  'Store Scale Estimate': { id: 'Estimasi skala toko', en: 'Store scale estimate', zh: '门店规模估计' },
  'Cooling vs Supplier': { id: 'Cooling vs Supplier', en: 'Cooling vs Supplier', zh: '冷却品类与供应商' },
  'Cooling Products Seen / Sold': { id: 'Produk cooling terlihat / dijual', en: 'Cooling products seen / sold', zh: '看到 / 销售的冷却产品' },
  'Cooling Shelf / Stock Size': { id: 'Ukuran rak / stok cooling', en: 'Cooling shelf / stock size', zh: '冷却产品货架 / 库存规模' },
  'Cooling Sales Activity': { id: 'Aktivitas penjualan cooling', en: 'Cooling sales activity', zh: '冷却产品销售活跃度' },
  'Cooling Brands Seen / Sold': { id: 'Brand cooling terlihat / dijual', en: 'Cooling brands seen / sold', zh: '看到 / 销售的冷却品牌' },
  'Low Cost Import Share': { id: 'Porsi import low cost', en: 'Low-cost import share', zh: '低价进口占比' },
  'Supplier Type': { id: 'Tipe supplier', en: 'Supplier type', zh: '供应商类型' },
  'Existing supplier name': { id: 'Nama supplier existing', en: 'Existing supplier name', zh: '现有供应商名称' },
  'Supplier Dependency': { id: 'Ketergantungan supplier', en: 'Supplier dependency', zh: '供应商依赖度' },
  'Supplier Satisfaction': { id: 'Kepuasan supplier', en: 'Supplier satisfaction', zh: '供应商满意度' },
  'Komersial & Follow-up': { id: 'Komersial & Follow-up', en: 'Commercial & Follow-up', zh: '商业与跟进' },
  'Restock Frequency': { id: 'Frekuensi restock', en: 'Restock frequency', zh: '补货频率' },
  'Average Purchase Size': { id: 'Rata-rata ukuran pembelian', en: 'Average purchase size', zh: '平均采购规模' },
  'Payment Method': { id: 'Metode pembayaran', en: 'Payment method', zh: '支付方式' },
  'Store Price Sensitivity': { id: 'Sensitivitas harga toko', en: 'Store price sensitivity', zh: '门店价格敏感度' },
  'Openness to New Alternative Brand': { id: 'Keterbukaan terhadap brand alternatif baru', en: 'Openness to new alternative brand', zh: '对新替代品牌的开放度' },
  'Main Reason to Try New Supplier': { id: 'Alasan utama mencoba supplier baru', en: 'Main reason to try a new supplier', zh: '尝试新供应商的主要原因' },
  'Surveyor notes': { id: 'Catatan surveyor', en: 'Surveyor notes', zh: '调研员备注' },
  'Photo Evidence': { id: 'Evidence foto', en: 'Photo Evidence', zh: '照片证据' },
  'Foto tampak depan wajib, tetapi belum tersedia pada record ini.': {
    id: 'Foto tampak depan wajib, tetapi belum tersedia pada record ini.',
    en: 'Storefront photo is required but is not available on this record.',
    zh: '门头照片为必填项，但此记录中尚未提供。',
  },
  'Foto dalam/rak belum tersedia dan alasan belum tercatat.': {
    id: 'Foto dalam/rak belum tersedia dan alasan belum tercatat.',
    en: 'Interior/rack photo is missing and no reason has been recorded.',
    zh: '店内/货架照片缺失，且未记录原因。',
  },
  'Foto PIC belum tersedia dan alasan belum tercatat.': {
    id: 'Foto PIC belum tersedia dan alasan belum tercatat.',
    en: 'PIC photo is missing and no reason has been recorded.',
    zh: '联系人照片缺失，且未记录原因。',
  },
  Available: { id: 'Tersedia', en: 'Available', zh: '可用' },
  Missing: { id: 'Belum tersedia', en: 'Missing', zh: '缺失' },
  Normal: { id: 'Normal', en: 'Normal', zh: '正常' },
  'Kontak customer': { id: 'Kontak pelanggan', en: 'Customer contact', zh: '客户联系方式' },
  'Tidak ada nomor': { id: 'Tidak ada nomor', en: 'No number available', zh: '无号码' },
  'Checklist kontak verifikator': { id: 'Checklist kontak verifikator', en: 'Verifier contact checklist', zh: '审核员联系方式检查表' },
  'Belum tersimpan': { id: 'Belum tersimpan', en: 'Not saved yet', zh: '尚未保存' },
  'Preview koordinat toko': { id: 'Preview koordinat toko', en: 'Store coordinate preview', zh: '门店坐标预览' },
  'Detail alamat toko': { id: 'Detail alamat toko', en: 'Store address details', zh: '门店地址详情' },
  'Koordinat perlu dicek:': { id: 'Koordinat perlu dicek:', en: 'Coordinates need review:', zh: '坐标需要复核：' },
  'jarak dari target': { id: 'jarak dari target', en: 'distance from target', zh: '距目标' },
  'dengan akurasi': { id: 'dengan akurasi', en: 'with accuracy', zh: '精度' },
  Patokan: { id: 'Patokan', en: 'Reference point', zh: '参照点' },
  'Google Maps': { id: 'Google Maps', en: 'Google Maps', zh: 'Google 地图' },
  Duplicate: { id: 'Duplikat', en: 'Duplicate', zh: '重复' },
  'WA Rule': { id: 'Aturan WhatsApp', en: 'WhatsApp rule', zh: 'WhatsApp 规则' },
  'WA terverifikasi reachable, eligible Hot Lead jika score tinggi': {
    id: 'WhatsApp terverifikasi reachable, eligible Hot Lead jika skor tinggi',
    en: 'WhatsApp is verified reachable and can qualify as Hot Lead if the score is high.',
    zh: 'WhatsApp 已确认可联系，若分数较高可进入高意向线索。',
  },
  'Nomor ada, tetapi WhatsApp ditandai tidak reachable': {
    id: 'Nomor ada, tetapi WhatsApp ditandai tidak reachable',
    en: 'A number exists, but WhatsApp is marked as not reachable.',
    zh: '号码存在，但 WhatsApp 被标记为无法联系。',
  },
  'WA kosong tanpa alasan': { id: 'WhatsApp kosong tanpa alasan', en: 'WhatsApp is missing without a reason.', zh: 'WhatsApp 缺失且未提供原因。' },
  'Nomor bisa ditelepon': { id: 'Nomor bisa ditelepon', en: 'The number can be called.', zh: '该号码可电话联系。' },
  'Nomor tidak bisa ditelepon': { id: 'Nomor tidak bisa ditelepon', en: 'The number cannot be called.', zh: '该号码无法电话联系。' },
  'Tidak ada nomor customer': { id: 'Tidak ada nomor pelanggan', en: 'No customer number available.', zh: '无客户号码。' },
  'Verification notes': { id: 'Catatan verifikasi', en: 'Verification notes', zh: '审核备注' },
  'Kembalikan data ke surveyor': { id: 'Kembalikan data ke surveyor', en: 'Return data to surveyor', zh: '退回给调研员' },
  'Jelaskan bagian yang perlu diperbaiki. Catatan ini akan dikirim ke surveyor sebagai instruksi revisi.': {
    id: 'Jelaskan bagian yang perlu diperbaiki. Catatan ini akan dikirim ke surveyor sebagai instruksi revisi.',
    en: 'Explain what must be corrected. This note will be sent to the surveyor as revision instructions.',
    zh: '说明需要修正的内容。该备注将作为修订说明发送给调研员。',
  },
  'Revision request': { id: 'Instruksi revisi', en: 'Revision instructions', zh: '修订说明' },
  'Contoh: Lengkapi foto PIC, cek ulang koordinat toko, dan konfirmasi nomor customer.': {
    id: 'Contoh: Lengkapi foto PIC, cek ulang koordinat toko, dan konfirmasi nomor pelanggan.',
    en: 'Example: Complete the PIC photo, recheck the store coordinates, and confirm the customer number.',
    zh: '示例：补充联系人照片、重新检查门店坐标并确认客户号码。',
  },
  'Instruksi ini akan muncul di form revisi surveyor.': {
    id: 'Instruksi ini akan muncul di form revisi surveyor.',
    en: "These instructions will appear in the surveyor's revision form.",
    zh: '这些说明会显示在调研员的修订表单中。',
  },
  Batal: { id: 'Batal', en: 'Cancel', zh: '取消' },
  'Verified Valid': { id: 'Terverifikasi Valid', en: 'Verified Valid', zh: '已验证有效' },
  'Merge Duplicate': { id: 'Gabungkan Duplikat', en: 'Merge Duplicate', zh: '合并重复' },
  'Pilih Toko Duplikat': { id: 'Pilih Toko Duplikat', en: 'Select Duplicate Store', zh: '选择重复门店' },
  'Warning Kandidat Duplikat': { id: 'Warning Kandidat Duplikat', en: 'Duplicate Warning Candidates', zh: '重复预警候选' },
  'Cari toko terverifikasi': { id: 'Cari toko terverifikasi', en: 'Search verified stores', zh: '搜索已验证门店' },
  'Nama toko, kode, kota, kecamatan, WA': { id: 'Nama toko, kode, kota, kecamatan, WhatsApp', en: 'Store name, code, city, district, WhatsApp', zh: '门店名称、编码、城市、区县、WhatsApp' },
  'Bandingkan Toko Duplikat': { id: 'Bandingkan Toko Duplikat', en: 'Compare Duplicate Stores', zh: '对比重复门店' },
  Match: { id: 'Kecocokan', en: 'Match', zh: '匹配' },
  'Skor kecocokan': { id: 'Skor kecocokan', en: 'Match score', zh: '匹配度' },
  'Tidak ada antrean verifikasi terbuka.': { id: 'Tidak ada antrean verifikasi terbuka.', en: 'There is no open verification queue.', zh: '暂无开放审核队列。' },
  'Tidak ada toko pada grup ini.': { id: 'Tidak ada toko pada grup ini.', en: 'There are no stores in this group.', zh: '此分组中暂无门店。' },
  'Antrean Belum Diverifikasi': { id: 'Antrean Belum Diverifikasi', en: 'Unverified Queue', zh: '待审核队列' },
  'Surveyor / Store': { id: 'Surveyor / Toko', en: 'Surveyor / Store', zh: '调研员 / 门店' },
  Agregasi: { id: 'Agregasi', en: 'Aggregate', zh: '汇总' },
  Aksi: { id: 'Aksi', en: 'Action', zh: '操作' },
  'umur tertua': { id: 'umur tertua', en: 'oldest age', zh: '最早时长' },
  'toko belum diverifikasi': { id: 'toko belum diverifikasi', en: 'unverified stores', zh: '家待审核门店' },
  Collapse: { id: 'Tutup', en: 'Collapse', zh: '收起' },
  Expand: { id: 'Buka', en: 'Expand', zh: '展开' },
  Refresh: { id: 'Refresh', en: 'Refresh', zh: '刷新' },
  'Market intelligence gagal dimuat.': { id: 'Intelijen pasar gagal dimuat.', en: 'Market intelligence failed to load.', zh: '市场情报加载失败。' },
  'Hot Lead export dibuat dalam format XLSX.': { id: 'Export Hot Lead dibuat dalam format XLSX.', en: 'Hot Lead export has been created as an XLSX file.', zh: '高意向线索已导出为 XLSX 文件。' },
  'Export Hot Lead gagal dibuat.': { id: 'Export Hot Lead gagal dibuat.', en: 'Failed to create Hot Lead export.', zh: '高意向线索导出失败。' },
  'MARKET INTELLIGENCE': { id: 'INTELIJEN PASAR', en: 'MARKET INTELLIGENCE', zh: '市场情报' },
  'Sinyal peluang cooling, supplier, dan lead siap follow-up': {
    id: 'Sinyal peluang cooling, supplier, dan lead siap follow-up',
    en: 'Cooling opportunities, supplier signals, and follow-up-ready leads',
    zh: '冷却品类机会、供应商信号和可跟进线索',
  },
  'Lead pipeline': { id: 'Pipeline lead', en: 'Lead pipeline', zh: '线索管道' },
  'WA reachable': { id: 'WhatsApp reachable', en: 'WA reachable', zh: 'WhatsApp 可联系' },
  'Dikonfirmasi verifikator': { id: 'Dikonfirmasi verifikator', en: 'Confirmed by verifier', zh: '审核员已确认' },
  'Supplier pain': { id: 'Keluhan supplier', en: 'Supplier pain', zh: '供应商痛点' },
  'Keluhan atau cari alternatif': { id: 'Keluhan atau cari alternatif', en: 'Complaints or looking for alternatives', zh: '投诉或正在寻找替代' },
  'Data reliability': { id: 'Reliabilitas data', en: 'Data reliability', zh: '数据可靠性' },
  'Kota terkuat': { id: 'Kota terkuat', en: 'Strongest city', zh: '最强城市' },
  'Brand paling terlihat': { id: 'Brand paling terlihat', en: 'Most visible brand', zh: '最常见品牌' },
  'Channel supplier dominan': { id: 'Channel supplier dominan', en: 'Dominant supplier channel', zh: '主导供应商渠道' },
  'Market Signal Map': { id: 'Peta Sinyal Pasar', en: 'Market Signal Map', zh: '市场信号图' },
  Brand: { id: 'Brand', en: 'Brand', zh: '品牌' },
  Supplier: { id: 'Supplier', en: 'Supplier', zh: '供应商' },
  Kota: { id: 'Kota', en: 'City', zh: '城市' },
  'Lead Classification': { id: 'Klasifikasi Lead', en: 'Lead Classification', zh: '线索分类' },
  'Priority Lead Worklist': { id: 'Daftar Kerja Lead Prioritas', en: 'Priority Lead Worklist', zh: '优先线索工作列表' },
  'Cari toko': { id: 'Cari toko', en: 'Search stores', zh: '搜索门店' },
  'Semua lead': { id: 'Semua lead', en: 'All leads', zh: '全部线索' },
  'Semua kota': { id: 'Semua kota', en: 'All cities', zh: '全部城市' },
  'Tidak ada lead pada filter aktif.': { id: 'Tidak ada lead pada filter aktif.', en: 'There are no leads for the active filter.', zh: '当前筛选条件下无线索。' },
  Store: { id: 'Toko', en: 'Store', zh: '门店' },
  'Data count': { id: 'Jumlah data', en: 'Data count', zh: '数据量' },
  'Bar length': { id: 'Panjang bar', en: 'Bar length', zh: '条形长度' },
  'of the top category': { id: 'dari kategori tertinggi', en: 'of the top category', zh: '相对于最高类别' },
  'Run rate': { id: 'Run rate', en: 'Run rate', zh: '运行速率' },
  'Target 30 hari': { id: 'Target 30 hari', en: '30-day target', zh: '30 天目标' },
  'Refresh survey trend': { id: 'Refresh tren survey', en: 'Refresh survey trend', zh: '刷新调研趋势' },
  'Survey trend mode': { id: 'Mode tren survey', en: 'Survey trend mode', zh: '调研趋势模式' },
  'Daily survey trend for': { id: 'Tren survey harian untuk', en: 'Daily survey trend for', zh: '每日调研趋势：' },
  'Total Users': { id: 'Total User', en: 'Total Users', zh: '用户总数' },
  'Active Users': { id: 'User Aktif', en: 'Active Users', zh: '活跃用户' },
  'Inactive Users': { id: 'User Nonaktif', en: 'Inactive Users', zh: '非活跃用户' },
  'Registered Polibeli accounts': { id: 'Akun Polibeli terdaftar', en: 'Registered Polibeli accounts', zh: '已注册 Polibeli 账号' },
  'Can access campaign app': { id: 'Dapat mengakses aplikasi campaign', en: 'Can access campaign app', zh: '可访问活动应用' },
  'Login access disabled': { id: 'Akses login dinonaktifkan', en: 'Login access disabled', zh: '登录权限已禁用' },
  'Add User': { id: 'Tambah User', en: 'Add User', zh: '新增用户' },
  'Detail User': { id: 'Detail User', en: 'User Detail', zh: '用户详情' },
  'Delete User': { id: 'Hapus User', en: 'Delete User', zh: '删除用户' },
  'Full Name': { id: 'Nama Lengkap', en: 'Full Name', zh: '全名' },
  Username: { id: 'Username', en: 'Username', zh: '用户名' },
  'Phone Number': { id: 'Nomor Telepon', en: 'Phone Number', zh: '电话号码' },
  Role: { id: 'Role', en: 'Role', zh: '角色' },
  Status: { id: 'Status', en: 'Status', zh: '状态' },
  Save: { id: 'Simpan', en: 'Save', zh: '保存' },
  Saving: { id: 'Menyimpan', en: 'Saving', zh: '保存中' },
  Edit: { id: 'Edit', en: 'Edit', zh: '编辑' },
  Deactivate: { id: 'Nonaktifkan', en: 'Deactivate', zh: '停用' },
  Activate: { id: 'Aktifkan', en: 'Activate', zh: '启用' },
  Delete: { id: 'Hapus', en: 'Delete', zh: '删除' },
  'Reset only': { id: 'Hanya reset', en: 'Reset only', zh: '仅重置' },
  'Unassigned manager': { id: 'Manager belum ditentukan', en: 'Unassigned manager', zh: '未分配经理' },
  'No manager required': { id: 'Tidak memerlukan manager', en: 'No manager required', zh: '无需经理' },
  'Leave blank to keep current password, or type a new one.': {
    id: 'Kosongkan untuk mempertahankan password saat ini, atau isi password baru.',
    en: 'Leave blank to keep the current password, or enter a new one.',
    zh: '留空表示保留当前密码，或输入新密码。',
  },
  'Set initial password for this user.': { id: 'Tetapkan password awal untuk user ini.', en: 'Set the initial password for this user.', zh: '设置此用户的初始密码。' },
  'Required for Surveyor accounts.': { id: 'Wajib untuk akun Surveyor.', en: 'Required for Surveyor accounts.', zh: '调研员账号必填。' },
};

const productionI18nPhrases: Record<string, Record<AppLanguage, string>> = {
  '0% dari target 5,000': { id: '0% dari target 5.000', en: '0% of 5,000 target', zh: '目标 5,000 的 0%' },
  '0.0% valid rate': { id: '0,0% tingkat valid', en: '0.0% valid rate', zh: '0.0% 有效率' },
  'Tips percakapan': { id: 'Tips percakapan', en: 'Conversation tip', zh: '沟通提示' },
  'Conversation tip': { id: 'Tips percakapan', en: 'Conversation tip', zh: '沟通提示' },
  'Supplier dissatisfaction': { id: 'Ketidakpuasan supplier', en: 'Supplier dissatisfaction', zh: '供应商不满意' },
  'Toko yang memberi sinyal keluhan atau sedang mencari alternatif supplier.': {
    id: 'Toko yang memberi sinyal keluhan atau sedang mencari alternatif supplier.',
    en: 'Stores showing complaints or actively looking for an alternative supplier.',
    zh: '出现投诉信号或正在寻找替代供应商的门店。',
  },
  'Prioritas untuk pitching supplier baru, harga lebih kompetitif, dan SLA pengiriman.': {
    id: 'Prioritas untuk pitching supplier baru, harga lebih kompetitif, dan SLA pengiriman.',
    en: 'Prioritize these stores for a new supplier pitch, competitive pricing, and delivery SLA.',
    zh: '优先向这些门店推荐新供应商、竞争性价格和配送 SLA。',
  },
  'Low cost import acceptance': { id: 'Penerimaan import low cost', en: 'Low-cost import acceptance', zh: '低价进口接受度' },
  'Toko yang terbuka terhadap opsi import ekonomis atau campuran.': {
    id: 'Toko yang terbuka terhadap opsi import ekonomis atau campuran.',
    en: 'Stores open to economical import options or mixed sourcing.',
    zh: '愿意接受经济型进口或混合采购方案的门店。',
  },
  'Menunjukkan ruang untuk positioning produk value-for-money dan margin.': {
    id: 'Menunjukkan ruang untuk positioning produk value-for-money dan margin.',
    en: 'Indicates room for value-for-money positioning and margin discussions.',
    zh: '表示可切入高性价比定位和利润空间沟通。',
  },
  'Owner reachable': { id: 'Owner dapat dihubungi', en: 'Owner reachable', zh: '店主可联系' },
  'Toko dengan nomor yang sudah dicek bisa ditelepon atau dihubungi via WhatsApp.': {
    id: 'Toko dengan nomor yang sudah dicek bisa ditelepon atau dihubungi via WhatsApp.',
    en: 'Stores with verified phone or WhatsApp reachability.',
    zh: '已确认可通过电话或 WhatsApp 联系的门店。',
  },
  'Menentukan kesiapan follow-up tanpa perlu enrichment kontak tambahan.': {
    id: 'Menentukan kesiapan follow-up tanpa perlu enrichment kontak tambahan.',
    en: 'Shows follow-up readiness without extra contact enrichment.',
    zh: '体现无需额外补充联系方式即可跟进的准备度。',
  },
  'Photo evidence complete': { id: 'Evidence foto lengkap', en: 'Photo evidence complete', zh: '照片证据完整' },
  'Survey dengan foto depan, rak/interior, dan PIC lengkap.': {
    id: 'Survey dengan foto depan, rak/interior, dan PIC lengkap.',
    en: 'Surveys with complete storefront, rack/interior, and PIC photos.',
    zh: '门头、货架/店内和联系人照片完整的调研。',
  },
  'Mengukur readiness data untuk verifikasi dan audit evidence.': {
    id: 'Mengukur kesiapan data untuk verifikasi dan audit evidence.',
    en: 'Measures data readiness for verification and evidence audit.',
    zh: '衡量数据进入审核和证据审计的准备度。',
  },
  'Pilih lead priority': { id: 'Pilih prioritas lead', en: 'Select lead priority', zh: '选择线索优先级' },
  'Rack / Interior': { id: 'Rak / Interior', en: 'Rack / Interior', zh: '货架 / 店内' },
  'Klik untuk lihat ukuran penuh': { id: 'Klik untuk melihat ukuran penuh', en: 'Click to view full size', zh: '点击查看完整尺寸' },
  'Store code': { id: 'Kode toko', en: 'Store code', zh: '门店编码' },
  'Store alias': { id: 'Alias toko', en: 'Store alias', zh: '门店别名' },
  'Planned / Unplanned': { id: 'Terencana / Tidak terencana', en: 'Planned / Unplanned', zh: '计划内 / 计划外' },
  'Product Selling Segment': { id: 'Segmen penjualan produk', en: 'Product selling segment', zh: '产品销售细分' },
  'Return Ease': { id: 'Kemudahan retur', en: 'Return ease', zh: '退货便利度' },
  'Delivery Speed': { id: 'Kecepatan pengiriman', en: 'Delivery speed', zh: '配送速度' },
  'Main Purchase Driver': { id: 'Pendorong utama pembelian', en: 'Main purchase driver', zh: '主要采购驱动因素' },
  'Willingness to Receive Follow-up': { id: 'Kesediaan menerima follow-up', en: 'Willingness to receive follow-up', zh: '接受跟进意愿' },
  'toko dalam kategori lead terpilih.': { id: 'toko dalam kategori lead terpilih.', en: 'stores in the selected lead category.', zh: '家门店属于所选线索分类。' },
  'Avg merchant': { id: 'Rata-rata merchant', en: 'Avg merchant', zh: '平均商户分' },
  'Avg data quality': { id: 'Rata-rata kualitas data', en: 'Avg data quality', zh: '平均数据质量' },
  'Kota dominan': { id: 'Kota dominan', en: 'Dominant city', zh: '主导城市' },
  'Submit terbaru': { id: 'Submit terbaru', en: 'Latest submit', zh: '最新提交' },
  'Tidak ada toko pada kategori ini.': { id: 'Tidak ada toko pada kategori ini.', en: 'No stores in this category.', zh: '此分类暂无门店。' },
  '7 hari terakhir': { id: '7 hari terakhir', en: 'Last 7 days', zh: '最近 7 天' },
  'Tidak ada toko untuk sinyal ini.': { id: 'Tidak ada toko untuk sinyal ini.', en: 'No stores match this signal.', zh: '暂无门店符合此信号。' },
  'Ubah filter surveyor atau tunggu data survey baru masuk.': {
    id: 'Ubah filter surveyor atau tunggu data survey baru masuk.',
    en: 'Change the surveyor filter or wait for new survey data.',
    zh: '请调整调研员筛选，或等待新的调研数据进入。',
  },
  'Tidak ada toko untuk metrik ini.': { id: 'Tidak ada toko untuk metrik ini.', en: 'No stores match this metric.', zh: '暂无门店符合此指标。' },
  'Data akan muncul saat ada survey yang memenuhi kriteria metrik.': {
    id: 'Data akan muncul saat ada survey yang memenuhi kriteria metrik.',
    en: 'Data will appear when surveys meet this metric criteria.',
    zh: '当调研符合该指标条件时会显示数据。',
  },
  'Data akan muncul setelah surveyor submit dari PWA Surveyor.': {
    id: 'Data akan muncul setelah surveyor submit dari PWA Surveyor.',
    en: 'Data will appear after surveyors submit from the Surveyor PWA.',
    zh: '调研员从 PWA 提交后会显示数据。',
  },
  'Pilih surveyor': { id: 'Pilih surveyor', en: 'Select surveyor', zh: '选择调研员' },
  'Pilih priority': { id: 'Pilih prioritas', en: 'Select priority', zh: '选择优先级' },
  'Visit Objective': { id: 'Tujuan kunjungan', en: 'Visit objective', zh: '拜访目标' },
  'Pilih visit objective': { id: 'Pilih tujuan kunjungan', en: 'Select visit objective', zh: '选择拜访目标' },
  'Special lead': { id: 'Lead khusus', en: 'Special lead', zh: '特殊线索' },
  'Pilih provinsi': { id: 'Pilih provinsi', en: 'Select province', zh: '选择省份' },
  'Pilih kota/kabupaten': { id: 'Pilih kota/kabupaten', en: 'Select city/regency', zh: '选择城市/县' },
  'Pilih kecamatan': { id: 'Pilih kecamatan', en: 'Select district', zh: '选择区县' },
  'Pilih desa/kelurahan': { id: 'Pilih desa/kelurahan', en: 'Select village', zh: '选择村/社区' },
  'Address Detail': { id: 'Detail alamat', en: 'Address detail', zh: '详细地址' },
  'Latitude target (opsional)': { id: 'Latitude target (opsional)', en: 'Target latitude (optional)', zh: '目标纬度（可选）' },
  'Longitude target (opsional)': { id: 'Longitude target (opsional)', en: 'Target longitude (optional)', zh: '目标经度（可选）' },
  'GPS berhasil dicapture, tetapi titik tidak ditemukan dalam boundary desa/kelurahan. Pilih lokasi manual.': {
    id: 'GPS berhasil dicapture, tetapi titik tidak ditemukan dalam boundary desa/kelurahan. Pilih lokasi manual.',
    en: 'GPS captured successfully, but the point is outside the village boundary. Select the location manually.',
    zh: 'GPS 已采集成功，但该点未落入村/社区边界。请手动选择位置。',
  },
  'GPS berhasil dicapture. Data boundary lokasi belum tersedia, pilih lokasi manual.': {
    id: 'GPS berhasil dicapture. Data boundary lokasi belum tersedia, pilih lokasi manual.',
    en: 'GPS captured successfully. Location boundary data is not available yet, so select the location manually.',
    zh: 'GPS 已采集成功。位置边界数据尚不可用，请手动选择位置。',
  },
  'GPS berhasil dicapture, tetapi lokasi otomatis gagal dibaca. Pilih lokasi manual.': {
    id: 'GPS berhasil dicapture, tetapi lokasi otomatis gagal dibaca. Pilih lokasi manual.',
    en: 'GPS captured successfully, but automatic location lookup failed. Select the location manually.',
    zh: 'GPS 已采集成功，但自动读取位置失败。请手动选择位置。',
  },
  'GPS perangkat tidak tersedia. Aktifkan layanan lokasi perangkat lalu coba lagi.': {
    id: 'GPS perangkat tidak tersedia. Aktifkan layanan lokasi perangkat lalu coba lagi.',
    en: 'Device GPS is not available. Enable location services and try again.',
    zh: '设备 GPS 不可用。请启用位置服务后重试。',
  },
  'GPS tidak bisa dicapture. Izinkan akses lokasi dan pastikan sinyal GPS perangkat aktif.': {
    id: 'GPS tidak bisa dicapture. Izinkan akses lokasi dan pastikan sinyal GPS perangkat aktif.',
    en: 'GPS cannot be captured. Allow location access and make sure the device GPS signal is active.',
    zh: '无法采集 GPS。请允许位置访问，并确认设备 GPS 信号已开启。',
  },
  'Pilih toko dari list terlebih dahulu sebelum menyimpan draft.': {
    id: 'Pilih toko dari daftar terlebih dahulu sebelum menyimpan draft.',
    en: 'Select a store from the list before saving a draft.',
    zh: '保存草稿前，请先从列表中选择门店。',
  },
  'Draft lokal tidak bisa disimpan. Kosongkan storage browser atau submit setelah koneksi stabil.': {
    id: 'Draft lokal tidak bisa disimpan. Kosongkan storage browser atau submit setelah koneksi stabil.',
    en: 'Local draft could not be saved. Clear browser storage or submit after the connection is stable.',
    zh: '无法保存本地草稿。请清理浏览器存储，或在网络稳定后提交。',
  },
  'Belum ada draft lokal untuk dimuat.': { id: 'Belum ada draft lokal untuk dimuat.', en: 'No local draft is available to load.', zh: '暂无可加载的本地草稿。' },
  'Draft lokal tidak bisa dibaca.': { id: 'Draft lokal tidak bisa dibaca.', en: 'Local draft could not be read.', zh: '无法读取本地草稿。' },
  'Survey toko ini sudah tersubmit. Buka revisi jika verifikator meminta perbaikan.': {
    id: 'Survey toko ini sudah tersubmit. Buka revisi jika verifikator meminta perbaikan.',
    en: 'This store survey has already been submitted. Open revision only if the verifier requests corrections.',
    zh: '该门店调研已提交。仅在审核员要求修正时打开修订。',
  },
  'Lengkapi field wajib sebelum submit survey.': {
    id: 'Lengkapi field wajib sebelum submit survey.',
    en: 'Complete all required fields before submitting the survey.',
    zh: '提交调研前请完成所有必填字段。',
  },
  'Submit gagal. Draft disimpan lokal.': { id: 'Submit gagal. Draft disimpan lokal.', en: 'Submission failed. Draft saved locally.', zh: '提交失败，草稿已本地保存。' },
  'Submit gagal dan draft lokal tidak bisa disimpan.': {
    id: 'Submit gagal dan draft lokal tidak bisa disimpan.',
    en: 'Submission failed and the local draft could not be saved.',
    zh: '提交失败，且无法保存本地草稿。',
  },
  'Draft lokal juga gagal disimpan.': {
    id: 'Draft lokal juga gagal disimpan.',
    en: 'The local draft also failed to save.',
    zh: '本地草稿也保存失败。',
  },
  'Capture GPS terlebih dahulu. Provinsi, kota, kecamatan, dan desa/kelurahan akan diisi otomatis jika titik masuk boundary.': {
    id: 'Capture GPS terlebih dahulu. Provinsi, kota, kecamatan, dan desa/kelurahan akan terisi otomatis jika titik berada di dalam boundary.',
    en: 'Capture GPS first. Province, city, district, and village will fill automatically when the point is inside a boundary.',
    zh: '请先采集 GPS。若坐标位于边界内，省、市、区县和村/社区将自动填写。',
  },
  'Outcome ini memakai jalur kunjungan singkat. Surveyor hanya perlu memastikan lokasi, mengisi alasan/kondisi, lalu submit untuk verifikasi.': {
    id: 'Outcome ini memakai alur kunjungan singkat. Surveyor cukup memastikan lokasi, mengisi alasan/kondisi, lalu submit untuk verifikasi.',
    en: 'This outcome uses the short visit flow. The surveyor only needs to confirm the location, enter the reason or condition, then submit for verification.',
    zh: '该结果使用简短拜访流程。调研员只需确认位置、填写原因或情况，然后提交审核。',
  },
  'Catatan alasan/kondisi kunjungan': { id: 'Catatan alasan/kondisi kunjungan', en: 'Visit reason or condition notes', zh: '拜访原因或情况备注' },
  'Foto bukti kunjungan (opsional)': { id: 'Foto bukti kunjungan (opsional)', en: 'Visit evidence photo (optional)', zh: '拜访凭证照片（可选）' },
  'Q26. Existing supplier name': { id: 'Q26. Nama supplier existing', en: 'Q26. Existing supplier name', zh: 'Q26. 现有供应商名称' },
  'Foto bukti:': { id: 'Foto bukti:', en: 'Evidence photo:', zh: '凭证照片：' },
  'Indikator ruang kerja surveyor': { id: 'Indikator ruang kerja surveyor', en: 'Surveyor workspace indicator', zh: '调研员工作区指示器' },
  'Field survey workspace sections': { id: 'Bagian ruang kerja field survey', en: 'Field survey workspace sections', zh: '外勤调研工作区分区' },
  'Report Type': { id: 'Tipe laporan', en: 'Report type', zh: '报告类型' },
  'Sudah tersubmit': { id: 'Sudah tersubmit', en: 'Already submitted', zh: '已提交' },
  'Survey Submitted': { id: 'Survey Terkirim', en: 'Survey Submitted', zh: '调研已提交' },
  'Revision request wajib diisi sebelum mengirim Need Revision.': {
    id: 'Instruksi revisi wajib diisi sebelum mengembalikan data ke surveyor.',
    en: 'Revision instructions are required before returning the data to the surveyor.',
    zh: '退回给调研员前必须填写修订说明。',
  },
  'Revision request wajib diisi untuk Need Revision.': {
    id: 'Instruksi revisi wajib diisi untuk mengembalikan data.',
    en: 'Revision instructions are required to return the data.',
    zh: '退回数据必须填写修订说明。',
  },
  'Isi revision request sebelum mengirim Need Revision.': {
    id: 'Isi instruksi revisi sebelum mengembalikan data ke surveyor.',
    en: 'Enter revision instructions before returning the data to the surveyor.',
    zh: '退回给调研员前请填写修订说明。',
  },
  'Proses Verifikasi': { id: 'Proses Verifikasi', en: 'Process Verification', zh: '处理审核' },
  'Angka kartu sementara memakai data antrean yang sudah termuat di halaman.': {
    id: 'Angka kartu sementara memakai data antrean yang sudah termuat di halaman.',
    en: 'Card values currently use the queue data already loaded on this page.',
    zh: '卡片数值当前使用页面已加载的队列数据。',
  },
  'Drill-down metrik': { id: 'Drill-down metrik', en: 'Metric drill-down', zh: '指标下钻' },
  'Data akan muncul saat ada antrean verifikasi yang memenuhi kriteria metrik.': {
    id: 'Data akan muncul saat ada antrean verifikasi yang memenuhi kriteria metrik.',
    en: 'Data will appear when verification queue items meet this metric criteria.',
    zh: '当审核队列项目符合该指标条件时会显示数据。',
  },
  'Foto perlu review': { id: 'Foto perlu review', en: 'Photo needs review', zh: '照片需复核' },
  'WA kosong': { id: 'WhatsApp kosong', en: 'WhatsApp missing', zh: 'WhatsApp 缺失' },
  'Tandai Toko Sebagai Duplikat': { id: 'Tandai Toko Sebagai Duplikat', en: 'Mark Store as Duplicate', zh: '标记为重复门店' },
  'Toko Awal': { id: 'Toko Awal', en: 'Original Store', zh: '原始门店' },
  'Kandidat Toko Terverifikasi': { id: 'Kandidat Toko Terverifikasi', en: 'Verified Store Candidate', zh: '已验证门店候选' },
  'Peta toko dan pembanding': { id: 'Peta toko dan pembanding', en: 'Store and comparison map', zh: '门店和对比地图' },
  'Tiga foto evidence': { id: 'Tiga foto evidence', en: 'Three evidence photos', zh: '三张凭证照片' },
  'Buka koordinat toko ini di Google Maps.': {
    id: 'Buka koordinat toko ini di Google Maps.',
    en: 'Open this store coordinate in Google Maps.',
    zh: '在 Google Maps 中打开该门店坐标。',
  },
  'Koordinat toko belum tersedia pada survey ini.': {
    id: 'Koordinat toko belum tersedia pada survey ini.',
    en: 'No store coordinates are available for this survey.',
    zh: '本次调研没有可用的门店坐标。',
  },
  'Import tidak tersedia untuk role ini.': {
    id: 'Import tidak tersedia untuk role ini.',
    en: 'Import is not available for this role.',
    zh: '该角色无法使用导入功能。',
  },
  'Hapus user': { id: 'Hapus user', en: 'Delete user', zh: '删除用户' },
  'Pilih role': { id: 'Pilih role', en: 'Select role', zh: '选择角色' },
  'Pilih manager': { id: 'Pilih manager', en: 'Select manager', zh: '选择经理' },
  'Pilih status': { id: 'Pilih status', en: 'Select status', zh: '选择状态' },
  'Belum ada klasifikasi lead.': { id: 'Belum ada klasifikasi lead.', en: 'No lead classification yet.', zh: '暂无线索分类。' },
  'Donut chart akan muncul setelah data survey tersedia.': {
    id: 'Donut chart akan muncul setelah data survey tersedia.',
    en: 'The donut chart will appear after survey data is available.',
    zh: '调研数据可用后将显示圆环图。',
  },
  'Lead classification donut chart': { id: 'Donut chart klasifikasi lead', en: 'Lead classification donut chart', zh: '线索分类圆环图' },
  'Slice aktif': { id: 'Slice aktif', en: 'Active slice', zh: '当前切片' },
  'toko dari': { id: 'toko dari', en: 'stores from', zh: '家门店，来自' },
  'klasifikasi lead pada scope aktif.': {
    id: 'klasifikasi lead pada scope aktif.',
    en: 'lead classification in the active scope.',
    zh: '当前范围内的线索分类。',
  },
  'Belum ada komposisi lead.': { id: 'Belum ada komposisi lead.', en: 'No lead mix yet.', zh: '暂无线索组合。' },
  'Data akan muncul setelah survey masuk pada filter aktif.': {
    id: 'Data akan muncul setelah survey masuk pada filter aktif.',
    en: 'Data will appear after surveys enter the active filter.',
    zh: '调研进入当前筛选后会显示数据。',
  },
  'Survey Trend': { id: 'Tren Survey', en: 'Survey Trend', zh: '调研趋势' },
  'Warning load': { id: 'Beban peringatan', en: 'Warning load', zh: '预警负载' },
  'perlu review,': { id: 'perlu review,', en: 'need review,', zh: '需复核，' },
  'Belum ada data time series.': { id: 'Belum ada data time series.', en: 'No time-series data yet.', zh: '暂无时间序列数据。' },
  'Chart akan muncul setelah survey pertama disubmit.': {
    id: 'Chart akan muncul setelah survey pertama disubmit.',
    en: 'The chart will appear after the first survey is submitted.',
    zh: '首次调研提交后会显示图表。',
  },
  'Assignment dari backend gagal dimuat.': { id: 'Assignment dari backend gagal dimuat.', en: 'Failed to load assignments from the backend.', zh: '无法从后端加载任务。' },
  'Assignment gagal disimpan.': { id: 'Assignment gagal disimpan.', en: 'Failed to save assignment.', zh: '保存任务失败。' },
  'Import target store gagal diproses backend.': { id: 'Import target store gagal diproses backend.', en: 'Target store import failed to process on the backend.', zh: '目标门店导入未能在后端处理。' },
  'Queue verifikasi gagal dimuat.': { id: 'Queue verifikasi gagal dimuat.', en: 'Failed to load verification queue.', zh: '审核队列加载失败。' },
  'Kandidat duplikat gagal dimuat.': { id: 'Kandidat duplikat gagal dimuat.', en: 'Failed to load duplicate candidates.', zh: '重复候选加载失败。' },
  'Keputusan verifikasi gagal disimpan.': { id: 'Keputusan verifikasi gagal disimpan.', en: 'Failed to save verification decision.', zh: '审核决定保存失败。' },
  'Status sistem gagal dimuat.': { id: 'Status sistem gagal dimuat.', en: 'Failed to load system status.', zh: '系统状态加载失败。' },
  'Failed to load users': { id: 'User gagal dimuat.', en: 'Failed to load users.', zh: '用户加载失败。' },
  'Request failed': { id: 'Request gagal diproses.', en: 'Request failed.', zh: '请求失败。' },
  Unauthorized: { id: 'Sesi tidak valid. Silakan login kembali.', en: 'Unauthorized. Please sign in again.', zh: '未授权。请重新登录。' },
  'Administrator access required': { id: 'Akses Administrator diperlukan.', en: 'Administrator access is required.', zh: '需要管理员权限。' },
  'Verificator access required': { id: 'Akses Verifikator diperlukan.', en: 'Verifier access is required.', zh: '需要审核员权限。' },
  'Failed to create auth user': { id: 'Gagal membuat akun auth user.', en: 'Failed to create the auth user.', zh: '创建认证用户失败。' },
  'Invalid push status query': { id: 'Query status push tidak valid.', en: 'Invalid push status query.', zh: '推送状态查询无效。' },
  'Invalid push subscription payload': { id: 'Payload subscription push tidak valid.', en: 'Invalid push subscription payload.', zh: '推送订阅内容无效。' },
  'Invalid notification list query': { id: 'Query daftar notifikasi tidak valid.', en: 'Invalid notification list query.', zh: '通知列表查询无效。' },
  'Notification not found': { id: 'Notifikasi tidak ditemukan.', en: 'Notification not found.', zh: '未找到通知。' },
  'Invalid dashboard time-series query': { id: 'Query time series dashboard tidak valid.', en: 'Invalid dashboard time-series query.', zh: '仪表盘时间序列查询无效。' },
  'Invalid dashboard metric': { id: 'Metrik dashboard tidak valid.', en: 'Invalid dashboard metric.', zh: '仪表盘指标无效。' },
  'Invalid dashboard metric store query': { id: 'Query toko metrik dashboard tidak valid.', en: 'Invalid dashboard metric store query.', zh: '仪表盘指标门店查询无效。' },
  'Invalid verification metric': { id: 'Metrik verifikasi tidak valid.', en: 'Invalid verification metric.', zh: '审核指标无效。' },
  'Invalid verification metric store query': { id: 'Query toko metrik verifikasi tidak valid.', en: 'Invalid verification metric store query.', zh: '审核指标门店查询无效。' },
  'Invalid assignment list query': { id: 'Query daftar assignment tidak valid.', en: 'Invalid assignment list query.', zh: '任务列表查询无效。' },
  'visitDate is invalid': { id: 'Tanggal kunjungan tidak valid.', en: 'Visit date is invalid.', zh: '拜访日期无效。' },
  'Invalid assignment payload': { id: 'Data assignment tidak valid.', en: 'Invalid assignment payload.', zh: '任务数据无效。' },
  'Location does not exist in master location data': {
    id: 'Lokasi tidak ditemukan di master data wilayah.',
    en: 'Location does not exist in the master location data.',
    zh: '位置不存在于主位置数据中。',
  },
  'Assigned surveyor is invalid or inactive': { id: 'Surveyor yang dipilih tidak valid atau tidak aktif.', en: 'Assigned surveyor is invalid or inactive.', zh: '分配的调研员无效或未启用。' },
  'Manager can only assign own surveyor team': { id: 'Manager hanya dapat memberi assignment ke tim surveyor sendiri.', en: 'Managers can only assign their own surveyor team.', zh: '经理只能分配自己的调研员团队。' },
  'Assigned surveyor auth user not found': { id: 'Akun auth surveyor yang dipilih tidak ditemukan.', en: 'Assigned surveyor auth user was not found.', zh: '未找到所分配调研员的认证账号。' },
  'Invalid reassignment payload': { id: 'Data reassignment tidak valid.', en: 'Invalid reassignment payload.', zh: '重新分配数据无效。' },
  'Assignment not found': { id: 'Assignment tidak ditemukan.', en: 'Assignment not found.', zh: '未找到任务。' },
  'Manager can only reassign own area': { id: 'Manager hanya dapat melakukan reassignment di area sendiri.', en: 'Managers can only reassign their own area.', zh: '经理只能重新分配自己的区域。' },
  'Assignment not found after update': { id: 'Assignment tidak ditemukan setelah update.', en: 'Assignment not found after update.', zh: '更新后未找到任务。' },
  'Invalid evidence payload': { id: 'Data evidence tidak valid.', en: 'Invalid evidence payload.', zh: '凭证数据无效。' },
  'Evidence must be a camera-captured image data URL': {
    id: 'Evidence harus berupa foto kamera dalam format data URL.',
    en: 'Evidence must be a camera-captured image data URL.',
    zh: '凭证必须是相机拍摄的图片 data URL。',
  },
  'Evidence image is too large after compression': { id: 'Ukuran foto evidence masih terlalu besar setelah kompresi.', en: 'Evidence image is too large after compression.', zh: '压缩后凭证图片仍过大。' },
  'Evidence not found': { id: 'Evidence tidak ditemukan.', en: 'Evidence not found.', zh: '未找到凭证。' },
  'Evidence is not accessible for this user': { id: 'Evidence tidak dapat diakses oleh user ini.', en: 'Evidence is not accessible for this user.', zh: '该用户无权访问此凭证。' },
  'Import template not found': { id: 'Template import tidak ditemukan.', en: 'Import template not found.', zh: '未找到导入模板。' },
  'Invalid XLSX import payload': { id: 'Payload import XLSX tidak valid.', en: 'Invalid XLSX import payload.', zh: 'XLSX 导入内容无效。' },
  'File XLSX tidak valid.': { id: 'File XLSX tidak valid.', en: 'Invalid XLSX file.', zh: 'XLSX 文件无效。' },
  'Province is required': { id: 'Provinsi wajib diisi.', en: 'Province is required.', zh: '省份为必填项。' },
  'Province and city are required': { id: 'Provinsi dan kota wajib diisi.', en: 'Province and city are required.', zh: '省份和城市为必填项。' },
  'Province, city, and district are required': { id: 'Provinsi, kota, dan kecamatan wajib diisi.', en: 'Province, city, and district are required.', zh: '省份、城市和区县为必填项。' },
  'Latitude and longitude are required': { id: 'Latitude dan longitude wajib diisi.', en: 'Latitude and longitude are required.', zh: '纬度和经度为必填项。' },
  'Invalid login payload': { id: 'Data login tidak valid.', en: 'Invalid login payload.', zh: '登录数据无效。' },
  'Invalid username or password': { id: 'Username atau password salah.', en: 'Invalid username or password.', zh: '用户名或密码无效。' },
  'User is inactive': { id: 'Akun user sedang nonaktif.', en: 'User is inactive.', zh: '用户账号未启用。' },
  'Invalid survey list query': { id: 'Query daftar survey tidak valid.', en: 'Invalid survey list query.', zh: '调研列表查询无效。' },
  'Invalid duplicate candidate query': { id: 'Query kandidat duplikat tidak valid.', en: 'Invalid duplicate candidate query.', zh: '重复候选查询无效。' },
  'Survey not found': { id: 'Survey tidak ditemukan.', en: 'Survey not found.', zh: '未找到调研。' },
  'Survey is not accessible for this user': { id: 'Survey tidak dapat diakses oleh user ini.', en: 'Survey is not accessible for this user.', zh: '该用户无权访问此调研。' },
  'Only Surveyor or Administrator can submit survey data': {
    id: 'Hanya Surveyor atau Administrator yang dapat submit data survey.',
    en: 'Only Surveyors or Administrators can submit survey data.',
    zh: '只有调研员或管理员可以提交调研数据。',
  },
  'Invalid survey payload': { id: 'Data survey tidak valid.', en: 'Invalid survey payload.', zh: '调研数据无效。' },
  'Surveyor can only submit assigned store data': {
    id: 'Surveyor hanya dapat submit data toko yang menjadi assignment-nya.',
    en: 'Surveyors can only submit stores assigned to them.',
    zh: '调研员只能提交分配给自己的门店数据。',
  },
  'Survey untuk assignment ini sudah tersubmit dan tidak bisa dikirim ulang.': {
    id: 'Survey untuk assignment ini sudah tersubmit dan tidak bisa dikirim ulang.',
    en: 'The survey for this assignment has already been submitted and cannot be submitted again.',
    zh: '该任务的调研已提交，不能重复提交。',
  },
  'WA empty reason is required when WhatsApp number is empty': {
    id: 'Alasan WhatsApp kosong wajib diisi jika nomor WhatsApp tidak tersedia.',
    en: 'A WhatsApp missing reason is required when the WhatsApp number is empty.',
    zh: 'WhatsApp 号码为空时必须填写原因。',
  },
  'Storefront photo is required for completed survey': { id: 'Foto tampak depan wajib untuk survey selesai.', en: 'Storefront photo is required for a completed survey.', zh: '已完成调研必须提供门头照片。' },
  'Photo missing reason is required when evidence photo is missing': {
    id: 'Alasan foto evidence kosong wajib diisi jika foto belum tersedia.',
    en: 'A missing photo reason is required when evidence photo is missing.',
    zh: '凭证照片缺失时必须填写原因。',
  },
  'PIC photo missing reason is required when PIC photo is missing': {
    id: 'Alasan foto PIC kosong wajib diisi jika foto PIC belum tersedia.',
    en: 'A missing PIC photo reason is required when the PIC photo is missing.',
    zh: '联系人照片缺失时必须填写原因。',
  },
  'Invalid verification payload': { id: 'Data verifikasi tidak valid.', en: 'Invalid verification payload.', zh: '审核数据无效。' },
  'Revision request is required for NEED_REVISION': {
    id: 'Instruksi revisi wajib diisi untuk mengembalikan data ke surveyor.',
    en: 'Revision instructions are required when returning data to the surveyor.',
    zh: '退回数据给调研员时必须填写修订说明。',
  },
  'Duplicate target is required for MERGED_DUPLICATE': {
    id: 'Target duplikat wajib dipilih untuk keputusan gabung duplikat.',
    en: 'A duplicate target is required for a merged duplicate decision.',
    zh: '合并重复时必须选择重复目标。',
  },
  'Duplicate target was not found': { id: 'Target duplikat tidak ditemukan.', en: 'Duplicate target was not found.', zh: '未找到重复目标。' },
  'Duplicate target must be a verified valid store': {
    id: 'Target duplikat harus merupakan toko yang sudah terverifikasi valid.',
    en: 'The duplicate target must be a verified valid store.',
    zh: '重复目标必须是已验证有效的门店。',
  },
  'Survey not found after update': { id: 'Survey tidak ditemukan setelah update.', en: 'Survey not found after update.', zh: '更新后未找到调研。' },
  'Invalid user payload': { id: 'Data user tidak valid.', en: 'Invalid user payload.', zh: '用户数据无效。' },
  'Surveyor must have a manager': { id: 'Surveyor wajib memiliki manager.', en: 'Surveyor must have a manager.', zh: '调研员必须设置经理。' },
  'Username already exists': { id: 'Username sudah digunakan.', en: 'Username already exists.', zh: '用户名已存在。' },
  'Auth user was not created': { id: 'Akun auth user gagal dibuat.', en: 'Auth user was not created.', zh: '认证用户未创建。' },
  'User not found': { id: 'User tidak ditemukan.', en: 'User not found.', zh: '未找到用户。' },
  'Auth user not found': { id: 'Akun auth user tidak ditemukan.', en: 'Auth user not found.', zh: '未找到认证用户。' },
  'User not found after update': { id: 'User tidak ditemukan setelah update.', en: 'User not found after update.', zh: '更新后未找到用户。' },
  'Invalid status payload': { id: 'Data status tidak valid.', en: 'Invalid status payload.', zh: '状态数据无效。' },
  'survey terlihat,': { id: 'survey terlihat,', en: 'visible surveys,', zh: '份调研可见，' },
  'lead prioritas,': { id: 'lead prioritas,', en: 'priority leads,', zh: '条优先线索，' },
  'masuk filter aktif.': { id: 'masuk filter aktif.', en: 'match the active filter.', zh: '条符合当前筛选。' },
  '- toko dalam kategori lead terpilih.': {
    id: '- toko dalam kategori lead terpilih.',
    en: '- stores in the selected lead category.',
    zh: '- 家门店属于所选线索分类。',
  },
  '- terakhir': { id: '- terakhir', en: '- latest', zh: '- 最新' },
  'toko - Avg M': { id: 'toko - Rata-rata M', en: 'stores - Avg M', zh: '家门店 - 平均 M' },
  '/ DQ': { id: '/ DQ', en: '/ DQ', zh: '/ 数据质量' },
  'Evidence photo was not found': { id: 'Foto evidence tidak ditemukan.', en: 'Evidence photo was not found.', zh: '未找到凭证照片。' },
  'Evidence photo belongs to another user': {
    id: 'Foto evidence milik user lain dan tidak dapat digunakan.',
    en: 'Evidence photo belongs to another user and cannot be used.',
    zh: '凭证照片属于其他用户，无法使用。',
  },
  'latitude dan longitude harus diisi berpasangan atau dikosongkan keduanya.': {
    id: 'Latitude dan longitude harus diisi berpasangan atau dikosongkan keduanya.',
    en: 'Latitude and longitude must be entered together or both left blank.',
    zh: '纬度和经度必须同时填写，或同时留空。',
  },
  'latitude harus berupa angka antara -90 sampai 90.': {
    id: 'Latitude harus berupa angka antara -90 sampai 90.',
    en: 'Latitude must be a number between -90 and 90.',
    zh: '纬度必须是 -90 到 90 之间的数字。',
  },
  'longitude harus berupa angka antara -180 sampai 180.': {
    id: 'Longitude harus berupa angka antara -180 sampai 180.',
    en: 'Longitude must be a number between -180 and 180.',
    zh: '经度必须是 -180 到 180 之间的数字。',
  },
  'Manager can only reassign own surveyor team': {
    id: 'Manager hanya dapat melakukan reassignment ke tim surveyor sendiri.',
    en: 'Managers can only reassign their own surveyor team.',
    zh: '经理只能重新分配自己的调研员团队。',
  },
  'Invalid location payload': { id: 'Data lokasi tidak valid.', en: 'Invalid location payload.', zh: '位置数据无效。' },
  'File XLSX memiliki terlalu banyak entry.': {
    id: 'File XLSX memiliki terlalu banyak entry.',
    en: 'The XLSX file has too many entries.',
    zh: 'XLSX 文件包含过多条目。',
  },
  'Struktur XLSX tidak valid.': { id: 'Struktur XLSX tidak valid.', en: 'The XLSX structure is invalid.', zh: 'XLSX 结构无效。' },
  'Entry XLSX terlalu besar.': { id: 'Entry XLSX terlalu besar.', en: 'An XLSX entry is too large.', zh: 'XLSX 条目过大。' },
  'File XLSX terlalu besar setelah diekstrak.': {
    id: 'File XLSX terlalu besar setelah diekstrak.',
    en: 'The XLSX file is too large after extraction.',
    zh: 'XLSX 文件解压后过大。',
  },
  'Ukuran entry XLSX tidak valid.': { id: 'Ukuran entry XLSX tidak valid.', en: 'The XLSX entry size is invalid.', zh: 'XLSX 条目大小无效。' },
  'Sheet pertama tidak ditemukan di file XLSX.': {
    id: 'Sheet pertama tidak ditemukan di file XLSX.',
    en: 'The first sheet was not found in the XLSX file.',
    zh: 'XLSX 文件中未找到第一个工作表。',
  },
  'Template XLSX kosong.': { id: 'Template XLSX kosong.', en: 'The XLSX template is empty.', zh: 'XLSX 模板为空。' },
  'BETTER_AUTH_SECRET is required in production.': {
    id: 'BETTER_AUTH_SECRET wajib disetel di production.',
    en: 'BETTER_AUTH_SECRET is required in production.',
    zh: '生产环境必须设置 BETTER_AUTH_SECRET。',
  },
};

Object.assign(i18nPhrases, additionalI18nPhrases, productionI18nPhrases);

const i18nExactIndex = new Map<string, string>();
const exactOnlyI18nTerms = new Set([
  'Toko',
  'Store',
  'Owner',
  'Manager',
  'Surveyor',
  'User',
  'Lead',
  'Quality',
  'Status',
  'Age',
  'Action',
  'Area',
  'GPS',
  'PIC',
  'Front',
  'Rack',
  'Plan',
  'Draft',
  'History',
  'Review',
  'Business',
  'Cooling',
  'Supplier',
  'Commercial',
  'Openness',
  'Photos',
  'Start',
  'Address',
  'Contact',
  'Radiator',
  'Condenser',
  'Water Pump',
  'Ready',
  'Revisit',
  'Warning',
  'Good',
  'Poor',
  'Small',
  'Medium',
  'Large',
  'Kecil',
  'Sedang',
  'Besar',
  'Import',
  'Assign',
  'Sync',
  'Export',
  'Download',
  'Reassign',
  'Qualified',
  'Strategic',
  'Canvasser',
]);

const i18nReplacementEntries = Object.entries(i18nPhrases)
  .flatMap(([source, translations]) => [
    source,
    translations.id,
    translations.en,
    translations.zh,
  ].map((variant) => ({ source, variant })))
  .filter(({ source, variant }) => {
    const text = variant.trim();
    if (text.length < 2 || exactOnlyI18nTerms.has(source)) return false;
    return text.length > 5 || /\s|[./:+-]/.test(text);
  })
  .sort((left, right) => right.variant.length - left.variant.length);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const i18nReplacementSourceByVariant = new Map<string, string>();
i18nReplacementEntries.forEach(({ source, variant }) => {
  if (!i18nReplacementSourceByVariant.has(variant)) i18nReplacementSourceByVariant.set(variant, source);
});

const i18nReplacementPattern = i18nReplacementEntries.length ? new RegExp(i18nReplacementEntries.map(({ variant }) => escapeRegExp(variant)).join('|'), 'g') : null;
const translateInlineCache = new Map<string, string>();

function rememberTranslation(cacheKey: string, value: string) {
  if (translateInlineCache.size > 12000) translateInlineCache.clear();
  translateInlineCache.set(cacheKey, value);
  return value;
}

Object.entries(i18nPhrases).forEach(([source, translations]) => {
  [source, translations.id, translations.en, translations.zh].forEach((variant) => {
    i18nExactIndex.set(variant.trim(), source);
  });
});

function translateInline(text: string, language: AppLanguage) {
  const cacheKey = `${language}\u0000${text}`;
  const cached = translateInlineCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const trimmed = text.trim();
  const canonical = i18nExactIndex.get(trimmed);
  if (canonical) return rememberTranslation(cacheKey, text.replace(trimmed, i18nPhrases[canonical][language]));

  let translated = text;
  if (i18nReplacementPattern) {
    translated = translated.replace(i18nReplacementPattern, (variant) => {
      const source = i18nReplacementSourceByVariant.get(variant);
      return source ? i18nPhrases[source][language] : variant;
    });
  }
  translated = translated
    .replace(/\b(\d+)\s+pending\b/gi, language === 'id' ? '$1 pending' : language === 'zh' ? '$1 待处理' : '$1 pending')
    .replace(/\b(\d+)\s+unread\b/gi, language === 'id' ? '$1 belum dibaca' : language === 'zh' ? '$1 未读' : '$1 unread')
    .replace(/\b(\d+)\s+records\b/gi, language === 'id' ? '$1 record' : language === 'zh' ? '$1 条记录' : '$1 records')
    .replace(/\b(\d+)\s+stores\b/gi, language === 'id' ? '$1 toko' : language === 'zh' ? '$1 家门店' : '$1 stores')
    .replace(/\b(\d+)\s+toko\b/gi, language === 'id' ? '$1 toko' : language === 'zh' ? '$1 家门店' : '$1 stores')
    .replace(/\b(\d+)\s+warning\b/gi, language === 'id' ? '$1 peringatan' : language === 'zh' ? '$1 个预警' : '$1 warning')
    .replace(/\b(\d+)\s+peringatan\b/gi, language === 'id' ? '$1 peringatan' : language === 'zh' ? '$1 个预警' : '$1 warning')
    .replace(/\bCampaign day\s+(\d+)\/(\d+)\b/gi, language === 'id' ? 'Hari campaign $1/$2' : language === 'zh' ? '活动第 $1/$2 天' : 'Campaign day $1/$2')
    .replace(/\bHari campaign\s+(\d+)\/(\d+)\b/gi, language === 'id' ? 'Hari campaign $1/$2' : language === 'zh' ? '活动第 $1/$2 天' : 'Campaign day $1/$2')
    .replace(/(\d+(?:\.\d+)?)m\s+dari\s+target,\s*akurasi\s+(\d+(?:\.\d+)?)m/gi, language === 'id' ? '$1m dari target, akurasi $2m' : language === 'zh' ? '距目标 $1 米，精度 $2 米' : '$1m from target, $2m accuracy')
    .replace(/jarak\s+dari\s+target\s+(\d+(?:\.\d+)?)m\s+dengan\s+akurasi\s+(\d+(?:\.\d+)?)m/gi, language === 'id' ? 'jarak dari target $1m dengan akurasi $2m' : language === 'zh' ? '距目标 $1 米，精度 $2 米' : '$1m from target with $2m accuracy')
    .replace(/(\d+(?:\.\d+)?)m\s+from\s+target,\s*(\d+(?:\.\d+)?)m\s+accuracy/gi, language === 'id' ? '$1m dari target, akurasi $2m' : language === 'zh' ? '距目标 $1 米，精度 $2 米' : '$1m from target, $2m accuracy')
    .replace(/距目标\s*(\d+(?:\.\d+)?)\s*米，精度\s*(\d+(?:\.\d+)?)\s*米/g, language === 'id' ? '$1m dari target, akurasi $2m' : language === 'zh' ? '距目标 $1 米，精度 $2 米' : '$1m from target, $2m accuracy')
    .replace(/\b(\d+)\s*KB\s+selected\b/gi, language === 'id' ? '$1 KB dipilih' : language === 'zh' ? '已选择 $1 KB' : '$1 KB selected')
    .replace(/\b(\d+)\s*KB\s+dipilih\b/gi, language === 'id' ? '$1 KB dipilih' : language === 'zh' ? '已选择 $1 KB' : '$1 KB selected')
    .replace(/已选择\s*(\d+)\s*KB/g, language === 'id' ? '$1 KB dipilih' : language === 'zh' ? '已选择 $1 KB' : '$1 KB selected')
    .replace(/\bMaksimal\s+(\d+)\s+pilihan\./gi, language === 'id' ? 'Maksimal $1 pilihan.' : language === 'zh' ? '最多选择 $1 项。' : 'Maximum $1 choices.')
    .replace(/\bMaximum\s+(\d+)\s+choices?\./gi, language === 'id' ? 'Maksimal $1 pilihan.' : language === 'zh' ? '最多选择 $1 项。' : 'Maximum $1 choices.')
    .replace(/最多选择\s*(\d+)\s*项。/g, language === 'id' ? 'Maksimal $1 pilihan.' : language === 'zh' ? '最多选择 $1 项。' : 'Maximum $1 choices.')
    .replace(/<\s*Rp\s*1\s*juta\s*\/\s*bulan/gi, language === 'id' ? '< Rp1 juta/bulan' : language === 'zh' ? '每月 < Rp100万' : '< Rp1 million/month')
    .replace(/Rp\s*1\s*[-–]\s*5\s*juta\s*\/\s*bulan/gi, language === 'id' ? 'Rp1-5 juta/bulan' : language === 'zh' ? '每月 Rp100万-500万' : 'Rp1-5 million/month')
    .replace(/Rp\s*5\s*[-–]\s*10\s*juta\s*\/\s*bulan/gi, language === 'id' ? 'Rp5-10 juta/bulan' : language === 'zh' ? '每月 Rp500万-1,000万' : 'Rp5-10 million/month')
    .replace(/Rp\s*10\s*[-–]\s*25\s*juta\s*\/\s*bulan/gi, language === 'id' ? 'Rp10-25 juta/bulan' : language === 'zh' ? '每月 Rp1,000万-2,500万' : 'Rp10-25 million/month')
    .replace(/>\s*Rp\s*25\s*juta\s*\/\s*bulan/gi, language === 'id' ? '> Rp25 juta/bulan' : language === 'zh' ? '每月 > Rp2,500万' : '> Rp25 million/month')
    .replace(/\bStep\s+(\d+)\/(\d+)\b/gi, language === 'id' ? 'Langkah $1/$2' : language === 'zh' ? '步骤 $1/$2' : 'Step $1/$2')
    .replace(/^(Start|Mulai|开始)\s+Survey$/i, language === 'id' ? 'Survey Awal' : language === 'zh' ? '调研开始' : 'Start Survey')
    .replace(/^(Address|Alamat|地址)\s+Survey$/i, language === 'id' ? 'Survey Alamat' : language === 'zh' ? '地址调研' : 'Address Survey')
    .replace(/^(Contact|Kontak|联系方式)\s+Survey$/i, language === 'id' ? 'Survey Kontak' : language === 'zh' ? '联系方式调研' : 'Contact Survey')
    .replace(/^(Business|Bisnis|业务)\s+Survey$/i, language === 'id' ? 'Survey Bisnis' : language === 'zh' ? '业务调研' : 'Business Survey')
    .replace(/^(Cooling|冷却产品)\s+Survey$/i, language === 'id' ? 'Survey Cooling' : language === 'zh' ? '冷却产品调研' : 'Cooling Survey')
    .replace(/^(Supplier|供应商)\s+Survey$/i, language === 'id' ? 'Survey Supplier' : language === 'zh' ? '供应商调研' : 'Supplier Survey')
    .replace(/^(Commercial|Komersial|商业)\s+Survey$/i, language === 'id' ? 'Survey Komersial' : language === 'zh' ? '商业调研' : 'Commercial Survey')
    .replace(/^(Openness|Keterbukaan|开放度)\s+Survey$/i, language === 'id' ? 'Survey Keterbukaan' : language === 'zh' ? '开放度调研' : 'Openness Survey')
    .replace(/^(Photos|Foto|照片)\s+Survey$/i, language === 'id' ? 'Survey Foto' : language === 'zh' ? '照片采集' : 'Photo Survey')
    .replace(/^(Review|复核)\s+Survey$/i, language === 'id' ? 'Review Survey' : language === 'zh' ? '调研复核' : 'Survey Review')
    .replace(/\b(\d+)\s+min\b/gi, language === 'id' ? '$1 menit' : language === 'zh' ? '$1 分钟' : '$1 min')
    .replace(/\b(\d+)\s+jam\b/gi, language === 'id' ? '$1 jam' : language === 'zh' ? '$1 小时' : '$1 hours')
    .replace(/\b(\d+)\s+hari\b/gi, language === 'id' ? '$1 hari' : language === 'zh' ? '$1 天' : '$1 days')
    .replace(/\bWA\s+Available\b/gi, language === 'id' ? 'WA tersedia' : language === 'zh' ? 'WhatsApp 可用' : 'WA available')
    .replace(/\bWA\s+Reachable\b/gi, language === 'id' ? 'WA reachable' : language === 'zh' ? 'WhatsApp 可联系' : 'WA reachable')
    .replace(/\bWA\s+Not reachable\b/gi, language === 'id' ? 'WA tidak reachable' : language === 'zh' ? 'WhatsApp 无法联系' : 'WA not reachable')
    .replace(/\bWA\s+Missing\b/gi, language === 'id' ? 'WA belum tersedia' : language === 'zh' ? 'WhatsApp 缺失' : 'WA missing')
    .replace(/\b(\d+)\s+survey terlihat,\s+(\d+)\s+lead prioritas,\s+(\d+)\s+masuk filter aktif\./gi, language === 'id' ? '$1 survey terlihat, $2 lead prioritas, $3 masuk filter aktif.' : language === 'zh' ? '当前可见 $1 份调研，$2 条优先线索，$3 条符合当前筛选。' : '$1 visible surveys, $2 priority leads, $3 match the active filter.')
    .replace(/\b(\d+)\s+visible surveys,\s+(\d+)\s+priority leads,\s+(\d+)\s+match the active filter\./gi, language === 'id' ? '$1 survey terlihat, $2 lead prioritas, $3 masuk filter aktif.' : language === 'zh' ? '当前可见 $1 份调研，$2 条优先线索，$3 条符合当前筛选。' : '$1 visible surveys, $2 priority leads, $3 match the active filter.')
    .replace(/当前可见\s*(\d+)\s*份调研，\s*(\d+)\s*条优先线索，\s*(\d+)\s*条符合当前筛选。/g, language === 'id' ? '$1 survey terlihat, $2 lead prioritas, $3 masuk filter aktif.' : language === 'zh' ? '当前可见 $1 份调研，$2 条优先线索，$3 条符合当前筛选。' : '$1 visible surveys, $2 priority leads, $3 match the active filter.')
    .replace(/^(.+)\s+sudah di-reassign ke\s+(.+)\.$/i, language === 'id' ? '$1 sudah di-reassign ke $2.' : language === 'zh' ? '$1 已重新分配给 $2。' : '$1 has been reassigned to $2.')
    .replace(/^(.+)\s+ditambahkan ke perencanaan kunjungan backend\.$/i, language === 'id' ? '$1 ditambahkan ke perencanaan kunjungan backend.' : language === 'zh' ? '$1 已加入后端拜访计划。' : '$1 has been added to backend visit planning.')
    .replace(/^(.+)\s+diproses:\s+(\d+)\s+assignment dibuat,\s+(\d+)\s+dilewati,\s+(\d+)\s+error\.$/i, language === 'id' ? '$1 diproses: $2 assignment dibuat, $3 dilewati, $4 error.' : language === 'zh' ? '$1 已处理：创建 $2 个任务，跳过 $3 条，$4 个错误。' : '$1 processed: $2 assignments created, $3 skipped, $4 errors.')
    .replace(/^(.+)\s+diproses:\s+(\d+)\s+dibuat,\s+(\d+)\s+dilewati,\s+(\d+)\s+error\.$/i, language === 'id' ? '$1 diproses: $2 dibuat, $3 dilewati, $4 error.' : language === 'zh' ? '$1 已处理：创建 $2 条，跳过 $3 条，$4 个错误。' : '$1 processed: $2 created, $3 skipped, $4 errors.')
    .replace(/^(.+)\s+gagal diproses\.$/i, language === 'id' ? '$1 gagal diproses.' : language === 'zh' ? '$1 处理失败。' : '$1 failed to process.')
    .replace(/^(.+)\s+siap diunduh dalam format XLSX\.$/i, language === 'id' ? '$1 siap diunduh dalam format XLSX.' : language === 'zh' ? '$1 已可下载为 XLSX。' : '$1 is ready to download as XLSX.')
    .replace(/^(.+)\s+gagal diunduh\.$/i, language === 'id' ? '$1 gagal diunduh.' : language === 'zh' ? '$1 下载失败。' : '$1 failed to download.')
    .replace(/^History submit toko\s+(.+)\s+dibuat dalam format XLSX\.$/i, language === 'id' ? 'History submit toko $1 dibuat dalam format XLSX.' : language === 'zh' ? '$1 的门店提交历史已导出为 XLSX。' : 'Store submit history for $1 has been created as XLSX.')
    .replace(/^History submit toko\s+(.+)\s+gagal dibuat\.$/i, language === 'id' ? 'History submit toko $1 gagal dibuat.' : language === 'zh' ? '$1 的门店提交历史导出失败。' : 'Store submit history for $1 failed to export.')
    .replace(/^(.+)\s+dipilih\. Form survey lengkap siap diisi\.$/i, language === 'id' ? '$1 dipilih. Form survey lengkap siap diisi.' : language === 'zh' ? '已选择 $1。完整调研表单已准备填写。' : '$1 selected. The full survey form is ready.')
    .replace(/^(.+)\s+Dibuka untuk revisi\.$/i, language === 'id' ? '$1 dibuka untuk revisi.' : language === 'zh' ? '$1 已打开用于修订。' : '$1 opened for revision.')
    .replace(/^(.+)\s+Detail survey dibuka\.$/i, language === 'id' ? 'Detail survey $1 dibuka.' : language === 'zh' ? '$1 的调研详情已打开。' : 'Survey detail for $1 opened.')
    .replace(/^(.+)\s+ditambahkan ke list\. Klik nama toko untuk membuka form survey\.$/i, language === 'id' ? '$1 ditambahkan ke daftar. Klik nama toko untuk membuka form survey.' : language === 'zh' ? '$1 已加入列表。点击门店名称打开调研表单。' : '$1 added to the list. Click the store name to open the survey form.')
    .replace(/^GPS berhasil dicapture\. Lokasi otomatis:\s+(.+),\s+(.+),\s+(.+)\.$/i, language === 'id' ? 'GPS berhasil dicapture. Lokasi otomatis: $1, $2, $3.' : language === 'zh' ? 'GPS 已采集成功。自动位置：$1、$2、$3。' : 'GPS captured successfully. Automatic location: $1, $2, $3.')
    .replace(/^Draft\s+(.+)\s+tersimpan lokal pada\s+(.+)\.$/i, language === 'id' ? 'Draft $1 tersimpan lokal pada $2.' : language === 'zh' ? '$1 草稿已于 $2 本地保存。' : 'Draft for $1 saved locally at $2.')
    .replace(/^Draft\s+(.+)\s+berhasil dimuat\.$/i, language === 'id' ? 'Draft $1 berhasil dimuat.' : language === 'zh' ? '$1 草稿已加载。' : 'Draft for $1 loaded successfully.')
    .replace(/^Survey\s+(.+)\s+masuk queue verifikasi\.$/i, language === 'id' ? 'Survey $1 masuk antrean verifikasi.' : language === 'zh' ? '$1 调研已进入审核队列。' : 'Survey for $1 entered the verification queue.')
    .replace(/^Submit gagal:\s+(.+?)\s+Draft lokal juga gagal disimpan\.$/i, language === 'id' ? 'Submit gagal: $1 Draft lokal juga gagal disimpan.' : language === 'zh' ? '提交失败：$1 本地草稿也保存失败。' : 'Submission failed: $1 The local draft also failed to save.')
    .replace(/^Submit gagal:\s+(.+)$/i, language === 'id' ? 'Submit gagal: $1' : language === 'zh' ? '提交失败：$1' : 'Submission failed: $1')
    .replace(/^(.+)\s+access required$/i, language === 'id' ? 'Akses $1 diperlukan.' : language === 'zh' ? '需要 $1 权限。' : '$1 access is required.')
    .replace(/^Metode kompresi XLSX tidak didukung:\s+(.+)$/i, language === 'id' ? 'Metode kompresi XLSX tidak didukung: $1' : language === 'zh' ? '不支持的 XLSX 压缩方法：$1' : 'Unsupported XLSX compression method: $1')
    .replace(/^Template XLSX maksimal\s+(\d+)\s+baris data\.$/i, language === 'id' ? 'Template XLSX maksimal $1 baris data.' : language === 'zh' ? 'XLSX 模板最多 $1 行数据。' : 'XLSX template supports a maximum of $1 data rows.')
    .replace(/^Header XLSX tidak sesuai template\. Header wajib:\s+(.+)$/i, language === 'id' ? 'Header XLSX tidak sesuai template. Header wajib: $1' : language === 'zh' ? 'XLSX 表头与模板不一致。必填表头：$1' : 'XLSX headers do not match the template. Required headers: $1')
    .replace(/^(.+)\s+berhasil ditambahkan\.$/i, language === 'id' ? '$1 berhasil ditambahkan.' : language === 'zh' ? '$1 已添加。' : '$1 has been added.')
    .replace(/^(.+)\s+berhasil diperbarui\.$/i, language === 'id' ? '$1 berhasil diperbarui.' : language === 'zh' ? '$1 已更新。' : '$1 has been updated.')
    .replace(/^(.+)\s+sekarang\s+(Active|Inactive|Aktif|Nonaktif|启用|未启用)\.$/i, language === 'id' ? '$1 sekarang $2.' : language === 'zh' ? '$1 当前为 $2。' : '$1 is now $2.')
    .replace(/^(.+)\s+berhasil dihapus\.$/i, language === 'id' ? '$1 berhasil dihapus.' : language === 'zh' ? '$1 已删除。' : '$1 has been deleted.')
    .replace(/^(\d+)\s+toko\s+-\s+Avg M\s+(\d+)\s*\/\s*DQ\s+(\d+)$/i, language === 'id' ? '$1 toko - Rata-rata M $2 / DQ $3' : language === 'zh' ? '$1 家门店 - 平均 M $2 / DQ $3' : '$1 stores - Avg M $2 / DQ $3')
    .replace(/^(\d+)\s+stores\s+-\s+Avg M\s+(\d+)\s*\/\s*DQ\s+(\d+)$/i, language === 'id' ? '$1 toko - Rata-rata M $2 / DQ $3' : language === 'zh' ? '$1 家门店 - 平均 M $2 / DQ $3' : '$1 stores - Avg M $2 / DQ $3')
    .replace(/^(\d+)\/(\d+)\s+toko$/i, language === 'id' ? '$1/$2 toko' : language === 'zh' ? '$1/$2 家门店' : '$1/$2 stores');

  return rememberTranslation(cacheKey, translated);
}

function useDomI18n(language: AppLanguage) {
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  }, [language]);

  useEffect(() => {
    const root = document.body;
    if (!root) return undefined;
    const translatableAttributes = ['aria-label', 'title', 'placeholder', 'alt'];
    const queuedNodes = new Set<Node>();
    let scheduled = 0;

    const shouldSkip = (node: Node) => {
      const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
      if (!element) return false;
      return Boolean(element.closest('[data-no-i18n], script, style, textarea, code, pre, .maplibregl-map, .gps-static-map-layer'));
    };

    const translateTextNode = (node: Node) => {
      if (shouldSkip(node)) return;
      const current = node.textContent ?? '';
      if (!current.trim()) return;
      const next = translateInline(current, language);
      if (next !== current) node.textContent = next;
    };

    const translateElementAttributes = (element: Element) => {
      if (shouldSkip(element)) return;
      translatableAttributes.forEach((attribute) => {
        const current = element.getAttribute(attribute);
        if (!current?.trim()) return;
        const next = translateInline(current, language);
        if (next !== current) element.setAttribute(attribute, next);
      });
    };

    const translateSubtree = (target: Node) => {
      if (target.nodeType === Node.TEXT_NODE) {
        translateTextNode(target);
        return;
      }
      if (target.nodeType !== Node.ELEMENT_NODE) return;
      const element = target as Element;
      translateElementAttributes(element);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let current = walker.nextNode();
      while (current) {
        if (current.nodeType === Node.TEXT_NODE) translateTextNode(current);
        if (current.nodeType === Node.ELEMENT_NODE) translateElementAttributes(current as Element);
        current = walker.nextNode();
      }
    };

    const queueTranslate = (target: Node) => {
      queuedNodes.add(target);
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(() => {
        scheduled = 0;
        const targets = Array.from(queuedNodes);
        queuedNodes.clear();
        targets.forEach(translateSubtree);
      });
    };

    queueTranslate(root);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(queueTranslate);
          return;
        }
        if (mutation.type === 'characterData' || mutation.type === 'attributes') {
          queueTranslate(mutation.target);
        }
      });
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatableAttributes,
    });

    return () => {
      observer.disconnect();
      if (scheduled) window.cancelAnimationFrame(scheduled);
    };
  }, [language]);
}

function getInitialLanguage(): AppLanguage {
  const stored = window.localStorage.getItem('klwt-language');
  return stored === 'en' || stored === 'zh' || stored === 'id' ? stored : defaultLanguage;
}

const drawerWidth = 288;
const roles: Role[] = ['Head', 'Manager', 'Surveyor', 'Verificator', 'Administrator'];
type NavItem = { key: ViewKey; label: string; icon: typeof DashboardRoundedIcon; roles: Role[]; hidden?: boolean };
const campaignStartDate = new Date('2026-04-20T00:00:00+07:00');
const campaignEndDate = new Date('2026-05-10T23:59:59+07:00');
const finalCampaignTarget = 5000;
const dailyTargetPerSurveyor = 13;

function jakartaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function jakartaDateFromKey(dateKey: string) {
  return new Date(`${dateKey}T23:00:00+07:00`);
}

function daysInclusive(start: Date, end: Date) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endUtc - startUtc) / 86_400_000) + 1;
}

const currentCampaignDateKey = jakartaDateKey();
const campaignCurrentDate = jakartaDateFromKey(currentCampaignDateKey);
const campaignTotalDays = daysInclusive(campaignStartDate, campaignEndDate);
const campaignElapsedDays = Math.min(campaignTotalDays, Math.max(1, daysInclusive(campaignStartDate, campaignCurrentDate)));
const surveyDraftStorageKey = 'klwt-survey-draft';

function safeWriteLocalJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const navItems: NavItem[] = [
  { key: 'command', label: 'Executive Dashboard', icon: DashboardRoundedIcon, roles: ['Head', 'Manager', 'Verificator', 'Administrator'] },
  { key: 'assignments', label: 'Visit Planning', icon: RouteRoundedIcon, roles: ['Manager', 'Administrator'] },
  { key: 'surveyor', label: 'Field Survey Workspace', icon: AddLocationAltRoundedIcon, roles: ['Surveyor', 'Administrator'] },
  { key: 'survey-detail', label: 'Survey Capture Form', icon: FactCheckRoundedIcon, roles: ['Surveyor', 'Administrator'], hidden: true },
  { key: 'verification', label: 'Verification Workbench', icon: FactCheckRoundedIcon, roles: ['Verificator', 'Administrator'] },
  { key: 'intelligence', label: 'Market Intelligence', icon: AnalyticsRoundedIcon, roles: ['Head', 'Manager', 'Administrator'] },
  { key: 'admin', label: 'Data Operations', icon: AdminPanelSettingsRoundedIcon, roles: ['Head', 'Manager', 'Verificator', 'Administrator'] },
  { key: 'users', label: 'Access Management', icon: ManageAccountsRoundedIcon, roles: ['Administrator'] },
];

const campaignPreviewCards = [
  { value: '5,000', label: 'Coverage target' },
  { value: '16', label: 'Active surveyors' },
  { value: String(campaignTotalDays), label: 'Campaign days' },
];

const emptyDashboardMetricCards = [
  {
    metric: 'submitted',
    label: 'Submitted visits',
    value: '0',
    helper: '0% dari target 5,000',
    progress: 0,
    icon: StorefrontRoundedIcon,
    tone: '#2fd0a8',
  },
  {
    metric: 'verified',
    label: 'Verified valid',
    value: '0',
    helper: '0.0% valid rate',
    progress: 0,
    icon: VerifiedRoundedIcon,
    tone: '#61c8ff',
  },
  {
    metric: 'hot',
    label: 'Hot leads',
    value: '0',
    helper: 'A/A+ + terbuka + WA',
    progress: 0,
    icon: FlashOnRoundedIcon,
    tone: '#f5c84c',
  },
  {
    metric: 'warnings',
    label: 'Warnings',
    value: '0',
    helper: 'GPS, foto, duplicate, revision',
    progress: 0,
    icon: WarningAmberRoundedIcon,
    tone: '#ff8b73',
  },
] satisfies Array<{
  metric: DashboardMetricKey;
  label: string;
  value: string;
  helper: string;
  progress: number;
  icon: typeof StorefrontRoundedIcon;
  tone: string;
}>;

type PlanItem = ReturnType<typeof planItemFromAssignment>;
const todayPlan: PlanItem[] = [];
let cachedSurveyorPlanItems: PlanItem[] = [];
let cachedSurveyorHistoryItems: SurveyHistoryItem[] = [];

const completedVisitOutcome = 'Survey Completed';
const fullSurveySteps = ['Visit & Location', 'Contact', 'Business', 'Cooling', 'Supplier', 'Commercial', 'Openness', 'Photos', 'Review'];
const exceptionSurveySteps = ['Visit & Location', 'Review'];
const incompleteSurveyPlaceholder = 'Tidak dikumpulkan - kunjungan tidak selesai';
const isCompletedVisit = (outcome: string) => outcome === completedVisitOutcome;
const surveyorListSlideLabels = ['Assigned Visits', 'Revision Queue', 'Submitted Reports'];
type Notice = { message: string; severity?: 'success' | 'info' | 'warning' | 'error' };
type AssignmentRow = {
  id: string;
  store: string;
  province: string;
  city: string;
  district: string;
  village: string;
  addressDetail: string;
  landmark: string;
  latitude: string;
  longitude: string;
  surveyorId: string;
  surveyor: string;
  managerId: string;
  manager: string;
  visitDate: string;
  priority: '' | 'High' | 'Medium' | 'Low';
  type: string;
  status: string;
  notes: string;
};

const emptyAssignmentForm: AssignmentRow = {
  id: '',
  store: '',
  province: '',
  city: '',
  district: '',
  village: '',
  addressDetail: '',
  landmark: '',
  latitude: '',
  longitude: '',
  surveyorId: '',
  surveyor: '',
  managerId: '',
  manager: '',
  visitDate: '',
  priority: '',
  type: '',
  status: '',
  notes: '',
};

function includeOption(options: string[], option: string) {
  if (!option || options.includes(option)) return options;
  return [...options, option].sort((left, right) => left.localeCompare(right, 'id-ID'));
}

function assignmentStatusLabel(status: string) {
  if (status === 'READY') return 'Ready';
  if (status === 'IN_PROGRESS') return 'In Progress';
  if (status === 'NO_GPS_YET') return 'No GPS';
  if (status === 'REVISIT') return 'Revisit';
  if (status === 'SUBMITTED') return 'Submitted';
  if (status === 'DRAFT') return 'Draft';
  return status || 'Ready';
}

function assignmentStatusValue(label: string) {
  if (label === 'Ready') return 'READY';
  if (label === 'In Progress') return 'IN_PROGRESS';
  if (label === 'No GPS') return 'NO_GPS_YET';
  if (label === 'Revisit') return 'REVISIT';
  if (label === 'Submitted') return 'SUBMITTED';
  if (label === 'Draft') return 'DRAFT';
  return label || 'READY';
}

function assignmentItemToRow(item: AssignmentItem): AssignmentRow {
  return {
    id: item.id,
    store: item.storeName,
    province: item.province,
    city: item.city,
    district: item.district,
    village: item.village,
    addressDetail: item.addressDetail,
    landmark: item.landmark,
    latitude: item.latitude,
    longitude: item.longitude,
    surveyorId: item.assignedSurveyorId,
    surveyor: item.assignedSurveyorName,
    managerId: item.assignedManagerId,
    manager: item.assignedManagerName,
    visitDate: item.visitDate.slice(0, 10),
    priority: item.priority,
    type: item.visitObjective,
    status: item.status,
    notes: item.notes,
  };
}

function planItemFromAssignment(item: AssignmentItem) {
  return {
    assignmentId: item.id,
    name: item.storeName,
    area: item.district,
    status: assignmentStatusLabel(item.status),
    tag: item.visitObjective,
    province: item.province,
    city: item.city,
    district: item.district,
    village: item.village,
    addressDetail: item.addressDetail,
    landmark: item.landmark,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}

function parseCoordinate(value: string | number | null | undefined) {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidLatitude(value: string | number | null | undefined) {
  const parsed = parseCoordinate(value);
  return parsed !== null && parsed >= -90 && parsed <= 90;
}

function isValidLongitude(value: string | number | null | undefined) {
  const parsed = parseCoordinate(value);
  return parsed !== null && parsed >= -180 && parsed <= 180;
}

function optionalCoordinatePairError(latitude: string | null | undefined, longitude: string | null | undefined) {
  const hasLatitude = Boolean(latitude?.trim());
  const hasLongitude = Boolean(longitude?.trim());
  if (!hasLatitude && !hasLongitude) return '';
  if (!hasLatitude || !hasLongitude) return 'Latitude dan longitude harus diisi berpasangan, atau kosongkan keduanya.';
  if (!isValidLatitude(latitude)) return 'Latitude harus berupa angka antara -90 sampai 90.';
  if (!isValidLongitude(longitude)) return 'Longitude harus berupa angka antara -180 sampai 180.';
  return '';
}

function distanceMetersBetween(
  sourceLatitude: string | number,
  sourceLongitude: string | number,
  targetLatitude: string | number | null | undefined,
  targetLongitude: string | number | null | undefined,
) {
  const sourceLat = parseCoordinate(sourceLatitude);
  const sourceLng = parseCoordinate(sourceLongitude);
  const targetLat = parseCoordinate(targetLatitude);
  const targetLng = parseCoordinate(targetLongitude);
  if (sourceLat === null || sourceLng === null || targetLat === null || targetLng === null) return 0;

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMeters = 6_371_000;
  const deltaLat = toRadians(targetLat - sourceLat);
  const deltaLng = toRadians(targetLng - sourceLng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(sourceLat)) * Math.cos(toRadians(targetLat)) * Math.sin(deltaLng / 2) ** 2;
  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function makeBarsFromCounts(counts: Record<string, number>, colors = ['#f5c84c', '#2fd0a8', '#61c8ff', '#ff8b73', '#b28cff']) {
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([label, value], index) => ({ label, value, color: colors[index % colors.length] }));
}

function pct(part: number, total: number) {
  return total ? `${Math.round((part / total) * 100)}%` : '0%';
}

const visitOutcomeOptions = [
  completedVisitOutcome,
  'Store Closed',
  'Address Not Found',
  'Moved Location',
  'Refused',
  'Not Relevant Store',
  'Duplicate Found',
  'Need Revisit',
];
const picTypeOptions = ['Owner', 'Karyawan'];
const waEmptyReasonOptions = [
  'Owner/PIC menolak memberi nomor',
  'Owner/PIC tidak tersedia',
  'Toko tidak memiliki nomor WA bisnis',
  'Akan diberikan saat revisit',
  'Lainnya',
];
const decisionMakerOptions = ['Owner', 'Anak owner / family', 'Kepala toko', 'Mekanik', 'Staff pembelian', 'Lainnya'];
const decisionAvailabilityOptions = ['Selalu ada', 'Pagi saja', 'Sore saja', 'By phone/WA', 'Jarang datang'];
const businessTypeOptions = [
  'General Sparepart Retail',
  'Wholesale Sparepart Distributor',
  'Workshop / Repair Garage',
  'Specialist Workshop',
  'Cooling Specialist / Radiator Shop',
  'AC & Cooling Specialist',
  'Multi-Service Auto Center',
  'Fleet / Commercial Workshop',
  'Other Automotive Merchant',
];
const vehicleSpecializationOptions = [
  'Japanese Passenger Car',
  'European Passenger Car',
  'Korean Passenger Car',
  'Chinese Car',
  'SUV/4x4',
  'Commercial Van/Pickup',
  'Diesel/Truck',
  'Universal Mixed',
];
const storeScaleOptions = ['Small', 'Medium', 'Large', 'Wholesale / Distributor scale'];
const coolingProductOptions = [
  'Radiator',
  'Condenser',
  'Cooling Fan',
  'Water Pump',
  'Radiator Hose',
  'Radiator Cap',
  'Coolant Accessories',
  'Tidak terlihat / tidak menjual cooling parts',
];
const coolingShelfOptions = ['Tidak terlihat cooling parts', 'Sedikit', 'Sedang', 'Banyak / dominan'];
const coolingActivityOptions = ['Jarang', 'Kadang', 'Cukup rutin', 'Sangat rutin'];
const coolingBrandOptions = ['Denso', 'Koyorad', 'TYC', 'GMB', 'Aisin', 'Astra/Aspira', 'Sakura', 'Generic China', 'Local No Brand', 'Tidak tahu / tidak terlihat'];
const productSegmentOptions = ['Genuine Premium Dominant', 'OEM Trusted Dominant', 'Mid Aftermarket Mixed', 'Economy / Low Cost Dominant'];
const lowCostShareOptions = ['Tidak ada', 'Sedikit', 'Campuran', 'Dominan'];
const supplierTypeOptions = ['Sales distributor datang', 'Grosir langganan', 'Importir', 'Marketplace', 'Ambil sendiri', 'Campur'];
const supplierDependencyOptions = ['Sangat tergantung 1 supplier', '2-3 supplier tetap', 'Supplier campuran fleksibel', 'Opportunistic buyer'];
const supplierSatisfactionOptions = ['Sangat puas', 'Cukup puas', 'Banyak keluhan', 'Sedang cari alternatif'];
const returnEaseOptions = ['Sangat mudah', 'Cukup mudah', 'Agak sulit', 'Sulit / hampir tidak bisa', 'Tidak tahu'];
const deliverySpeedOptions = ['Hari yang sama', 'Besok', '2-3 hari', 'Lebih lama / inden', 'Tidak tahu'];
const restockFrequencyOptions = ['Hampir tiap hari', 'Mingguan', 'Bulanan', 'Hanya saat ada permintaan', 'Tidak tahu'];
const purchaseSizeOptions = ['Kecil', 'Sedang', 'Besar', 'Tidak bersedia menjawab', 'Tidak tahu'];
const monthlyPurchaseOptions = ['< Rp1 juta / bulan', 'Rp1-5 juta / bulan', 'Rp5-10 juta / bulan', 'Rp10-25 juta / bulan', '> Rp25 juta / bulan', 'Tidak bersedia menjawab', 'Tidak tahu'];
const paymentMethodOptions = ['CBD transfer dulu', 'COD barang datang', 'Tempo 7 hari', 'Tempo 14 hari', 'Tempo 30 hari+', 'Campur / konsinyasi', 'Tidak bersedia menjawab', 'Tidak tahu'];
const marginExpectationOptions = ['< 10%', '10-15%', '16-25%', '> 25%', 'Tidak bersedia menjawab', 'Tidak tahu'];
const orderMethodOptions = ['Didatangi sales canvasser', 'Order WhatsApp', 'Telepon', 'Marketplace', 'Ambil sendiri'];
const purchaseDriverOptions = ['Harga murah', 'Margin besar', 'Brand terkenal', 'Kualitas stabil', 'Barang lengkap', 'Fast delivery', 'Retur mudah', 'Tempo pembayaran'];
const priceSensitivityOptions = ['Sangat harga', 'Harga & kualitas seimbang', 'Lebih cari merk terkenal'];
const opennessOptions = ['Sangat terbuka', 'Bisa coba', 'Hanya merk tertentu', 'Tidak suka coba baru'];
const reasonTryOptions = ['Harga lebih murah', 'Margin lebih besar', 'Barang lebih lengkap', 'Tempo lebih enak', 'Retur lebih gampang', 'Pengiriman cepat', 'Kualitas lebih stabil', 'Tidak tertarik'];
const followUpOptions = ['Mau dihubungi', 'Boleh kirim katalog/price list dulu', 'Perlu bicara owner', 'Tidak tertarik saat ini'];
const photoMissingReasonOptions = ['Toko melarang foto area dalam', 'Owner/PIC menolak foto orang', 'Toko sedang ramai', 'Alasan keamanan/privasi', 'Lainnya'];

const hintUiCopy: Record<AppLanguage, { title: string; action: string }> = {
  id: { title: 'Tips percakapan', action: 'Lihat tips percakapan' },
  en: { title: 'Conversation tip', action: 'View conversation tip' },
  zh: { title: '沟通提示', action: '查看沟通提示' },
};

const surveyQuestionHints: Record<string, SurveyHint> = {
  'Q1. Visit Outcome': {
    id: 'Catat hasil kunjungan apa adanya. Jika toko tutup, ditolak, atau alamat tidak ditemukan, pilih status yang sesuai agar visit tetap valid tanpa membuat data palsu.',
    en: 'Record the visit outcome honestly. If the store is closed, refuses, or cannot be found, choose the matching status so the visit stays valid without forcing fake data.',
    zh: '请如实记录拜访结果。若门店关门、拒访或地址未找到，请选择对应状态，让拜访记录有效且不需要编造数据。',
  },
  'Selected store': {
    id: 'Pastikan toko yang dipilih sesuai dengan toko yang sedang dikunjungi sebelum mulai mengisi detail.',
    en: 'Confirm that the selected store is the same store you are visiting before filling in the details.',
    zh: '填写详情前，请确认已选择的门店就是当前拜访的门店。',
  },
  'Store name': {
    id: 'Untuk toko unplanned, gunakan nama yang paling dikenal pelanggan atau yang terlihat di papan toko.',
    en: 'For an unplanned store, use the name customers know best or the name shown on the storefront sign.',
    zh: '对于计划外门店，请填写客户最熟悉的名称，或门店招牌上显示的名称。',
  },
  'Store alias / nama papan toko': {
    id: 'Tanyakan dengan ringan: "Nama di papan toko atau yang biasa dikenal pelanggan apa ya Pak/Bu?" Alias membantu pencarian ulang dan deduplikasi.',
    en: 'Ask naturally: "What name is shown on the signboard, or what name do customers usually know this store by?" The alias helps later search and deduplication.',
    zh: '可自然询问：“招牌上的名称，或客户平时熟悉的店名是什么？”别名有助于后续检索和去重。',
  },
  'GPS Auto Capture': {
    id: 'Tidak perlu ditanyakan ke toko. Pastikan GPS HP aktif dan tunggu titik cukup stabil sebelum lanjut.',
    en: 'No need to ask the store. Make sure the phone GPS is active and wait until the location point is reasonably stable before continuing.',
    zh: '无需向门店询问。请确认手机 GPS 已开启，并等待定位点相对稳定后再继续。',
  },
  Province: {
    id: 'Isi dari lokasi kunjungan. Jika ragu, konfirmasi singkat tanpa membuat percakapan terasa seperti pendataan administratif.',
    en: 'Fill this from the visit location. If unsure, confirm briefly without making the conversation feel like an administrative audit.',
    zh: '请根据拜访地点填写。如不确定，可简短确认，避免让对话像行政审查。',
  },
  City: {
    id: 'Jika batas wilayah tidak jelas, tanyakan: "Ini masuk Kota/Kabupaten apa ya Pak/Bu?"',
    en: 'If the administrative boundary is unclear, ask: "Which city or regency does this area belong to?"',
    zh: '如果行政区划不明确，可问：“这里属于哪个市/县？”',
  },
  Kecamatan: {
    id: 'Tanyakan hanya jika belum yakin: "Kalau kecamatan di sini masuk mana ya Pak/Bu?"',
    en: 'Ask only when unsure: "Which district does this area belong to?"',
    zh: '仅在不确定时询问：“这里属于哪个区/镇？”',
  },
  'Desa/Kelurahan': {
    id: 'Gunakan pertanyaan singkat: "Kelurahannya di sini apa ya Pak/Bu?" untuk membantu akurasi follow-up.',
    en: 'Use a short question: "What village or subdistrict is this?" to improve follow-up accuracy.',
    zh: '可简短询问：“这里属于哪个村/街道？”以提高后续跟进地址准确性。',
  },
  'Detailed Address': {
    id: 'Minta patokan yang mudah dipakai tim lain: "Kalau nanti ada tim datang lagi, patokan paling gampang apa Pak/Bu?"',
    en: 'Ask for a landmark another team can use: "If another team visits later, what is the easiest landmark to use?"',
    zh: '请询问便于其他团队复访的地标：“如果之后有团队再来，最容易识别的参照点是什么？”',
  },
  'Landmark / patokan': {
    id: 'Catat penanda visual seperti sebelah toko ban, depan SPBU, ruko warna tertentu, atau simpang terdekat.',
    en: 'Capture visual references such as next to a tire shop, across from a gas station, a specific shop-house color, or the nearest intersection.',
    zh: '记录可视化参照，例如靠近轮胎店、加油站对面、某颜色商铺，或最近路口。',
  },
  'PIC / narasumber': {
    id: 'Tanyakan sopan: "Boleh saya catat nama Bapak/Ibu yang saya ajak ngobrol, supaya follow-up nanti tidak salah panggil?"',
    en: 'Ask politely: "May I note your name so any follow-up later addresses the right person?"',
    zh: '可礼貌询问：“方便记录您的姓名吗？这样后续跟进时不会称呼错人。”',
  },
  'WhatsApp number': {
    id: 'Jelaskan manfaatnya: "Kalau nanti ada info harga atau katalog cooling yang cocok, nomor WhatsApp toko yang bisa dihubungi apa Pak/Bu?"',
    en: 'Explain the benefit: "If there is suitable pricing or a cooling parts catalogue later, which store WhatsApp number should be contacted?"',
    zh: '说明用途：“如果后续有合适的价格信息或冷却产品目录，可以联系门店哪个 WhatsApp 号码？”',
  },
  'Q11. PIC Type': {
    id: 'Konfirmasi peran dengan natural: "Bapak/Ibu owner langsung atau bagian toko ya?" Jawaban owner biasanya punya bobot keputusan lebih tinggi.',
    en: 'Confirm the role naturally: "Are you the owner or part of the store team?" Owner answers usually carry stronger decision weight.',
    zh: '自然确认身份：“您是店主本人，还是门店工作人员？”店主回答通常具有更高决策权重。',
  },
  'Q13. Reason if WhatsApp Empty': {
    id: 'Jika nomor tidak diberikan, tenangkan toko: "Tidak apa-apa Pak/Bu, saya catat bahwa nomor belum bisa diberikan."',
    en: 'If no number is provided, reassure the store: "That is okay, I will note that the number cannot be shared yet."',
    zh: '如果未提供号码，请安抚对方：“没关系，我会记录目前还不能提供号码。”',
  },
  'Q14. Purchasing Decision Maker': {
    id: 'Tanyakan konteks pembelian: "Kalau biasanya ambil barang dari supplier, yang memutuskan pesan barang siapa Pak/Bu?"',
    en: 'Ask in a purchasing context: "When ordering from suppliers, who usually decides what to buy?"',
    zh: '从采购场景切入：“平时向供应商拿货时，通常是谁决定采购？”',
  },
  'Q15. Decision Maker Availability': {
    id: 'Arahkan ke follow-up: "Kalau nanti ada penawaran, waktu paling cocok ketemu owner/PIC kapan ya?"',
    en: 'Frame it around follow-up: "If there is an offer later, what is the best time to meet the owner or PIC?"',
    zh: '围绕后续跟进询问：“如果之后有报价，什么时候最适合见店主或联系人？”',
  },
  'Q16. Main Business Type': {
    id: 'Buat pilihan terasa percakapan: "Toko ini lebih dominan sparepart umum, radiator, AC mobil, atau bengkel juga Pak/Bu?"',
    en: 'Make the options conversational: "Is this mainly a general parts store, radiator shop, car AC specialist, or also a workshop?"',
    zh: '把选项说成自然对话：“这里主要是综合配件、 radiator/水箱、汽车空调，还是也做维修？”',
  },
  'Q17. Vehicle Specialization': {
    id: 'Tanyakan segmen kendaraan yang paling sering dilayani, terutama untuk radiator dan cooling.',
    en: 'Ask which vehicle segments they serve most often, especially for radiator and cooling parts.',
    zh: '询问最常服务的车型类别，尤其是 radiator/水箱和冷却系统相关需求。',
  },
  'Q18. Store Scale Estimate': {
    id: 'Boleh dinilai dari observasi ukuran toko, jumlah rak, aktivitas pelanggan, dan stok. Jangan memaksa toko menyebut angka.',
    en: 'You may estimate this from store size, shelf count, customer activity, and stock level. Do not force the store to state numbers.',
    zh: '可根据门店规模、货架数量、客流和库存进行判断，不必要求门店提供具体数字。',
  },
  'Q19. Cooling Products Seen / Sold': {
    id: 'Tanyakan kategori utama: "Untuk cooling, biasanya ada radiator, condenser, kipas, water pump, atau selang radiator Pak/Bu?"',
    en: 'Ask by category: "For cooling parts, do you usually carry radiators, condensers, fans, water pumps, or radiator hoses?"',
    zh: '按品类询问：“冷却类产品通常有 radiator/水箱、冷凝器、风扇、水泵或水管吗？”',
  },
  'Q20. Cooling Shelf / Stock Size': {
    id: 'Jika stok terlihat, tanya apakah itu ready stock atau hanya display. Jika tidak terlihat, tanya apakah barang diambil saat ada permintaan.',
    en: 'If stock is visible, ask whether it is ready stock or display only. If not visible, ask whether they source it only when requested.',
    zh: '若看到库存，可问是常备库存还是仅展示；若未看到，可问是否有需求时才调货。',
  },
  'Q21. Cooling Sales Activity': {
    id: 'Fokus ke frekuensi permintaan, bukan hanya stok di rak. Toko dengan stok kecil tapi permintaan rutin tetap bernilai.',
    en: 'Focus on request frequency, not only shelf stock. A store with limited stock but routine demand can still be valuable.',
    zh: '重点了解需求频率，而不只是货架库存。库存少但需求稳定的门店仍有价值。',
  },
  'Q22. Cooling Brands Seen / Sold': {
    id: 'Tanyakan brand yang sering jalan: "Customer lebih sering cari brand tertentu atau yang penting cocok dan harga masuk?"',
    en: 'Ask what brands move: "Do customers usually ask for specific brands, or mainly care that the part fits and the price works?"',
    zh: '询问常卖品牌：“客户通常指定品牌，还是更看重适配和价格合适？”',
  },
  'Other brand / supplier brand manual': {
    id: 'Isi hanya jika ada brand lain yang disebut atau terlihat. Jangan mengarang brand jika toko tidak yakin.',
    en: 'Fill this only when another brand is mentioned or visible. Do not invent a brand if the store is unsure.',
    zh: '仅在门店提到或现场看到其他品牌时填写；若门店不确定，请不要猜写品牌。',
  },
  'Q23. Product Selling Segment': {
    id: 'Tanyakan preferensi pelanggan: original/premium, OEM trusted, campuran aftermarket, atau ekonomis.',
    en: 'Ask about customer preference: original or premium, trusted OEM, mixed aftermarket, or economy options.',
    zh: '询问客户偏好：原厂/高端、可信 OEM、混合售后，还是经济型选择。',
  },
  'Q24. Low Cost Import Share': {
    id: 'Jaga netral: "Barang import harga ekonomis biasanya ada juga di sini atau lebih banyak brand premium?"',
    en: 'Keep it neutral: "Do you also carry economical imported parts, or mostly premium brands?"',
    zh: '保持中性：“这里也有经济型进口件，还是以高端品牌为主？”',
  },
  'Q25. Supplier Type': {
    id: 'Tanyakan channel pasokan: sales datang, grosir langganan, marketplace, importir, atau ambil sendiri.',
    en: 'Ask about supply channels: visiting sales, regular wholesaler, marketplace, importer, or self pickup.',
    zh: '询问供货渠道：销售上门、固定批发商、电商平台、进口商，还是自己取货。',
  },
  'Q26. Existing supplier name (optional)': {
    id: 'Ini sensitif. Katakan: "Kalau tidak nyaman menyebut nama supplier, tidak apa-apa; saya catat tipe supplier-nya saja."',
    en: 'This is sensitive. Say: "If you are not comfortable naming the supplier, that is okay; I can just note the supplier type."',
    zh: '这是敏感问题。可说：“如果不方便说供应商名称没关系，我只记录供应商类型也可以。”',
  },
  'Q27. Supplier Dependency': {
    id: 'Tanyakan apakah toko bergantung pada satu supplier utama atau fleksibel memilih beberapa supplier berdasarkan stok dan harga.',
    en: 'Ask whether the store depends on one main supplier or flexibly uses several suppliers based on stock and price.',
    zh: '询问门店是依赖一个主要供应商，还是会根据库存和价格灵活选择多个供应商。',
  },
  'Q28. Supplier Satisfaction': {
    id: 'Gali pain point tanpa menekan: harga, stok, retur, atau pengiriman. Ketidakpuasan adalah sinyal peluang KLWT.',
    en: 'Explore pain points gently: price, stock, returns, or delivery. Supplier dissatisfaction is a key KLWT opportunity signal.',
    zh: '温和了解痛点：价格、库存、退货或配送。对现有供应商不满是 KLWT 的重要机会信号。',
  },
  'Q29. Return Ease': {
    id: 'Tanyakan pengalaman retur barang cooling yang tidak cocok atau bermasalah. Ini sering menentukan loyalitas toko.',
    en: 'Ask about return experience for cooling parts that do not fit or have issues. This often shapes store loyalty.',
    zh: '询问冷却件不适配或有问题时的退货体验，这通常会影响门店对供应商的忠诚度。',
  },
  'Q30. Delivery Speed': {
    id: 'Tanyakan waktu barang datang setelah order: hari yang sama, besok, 2-3 hari, atau inden.',
    en: 'Ask how long items usually take after ordering: same day, next day, 2-3 days, or backorder.',
    zh: '询问下单后到货时间：当天、次日、2-3 天，还是需要预订等待。',
  },
  'Q31. Restock Frequency': {
    id: 'Cari tahu apakah cooling direstock rutin atau hanya saat ada permintaan. Ini menunjukkan potensi repeat order.',
    en: 'Find out whether cooling parts are restocked routinely or only when requested. This indicates repeat-order potential.',
    zh: '了解冷却件是定期补货，还是有需求才采购。这能反映重复订单潜力。',
  },
  'Q32. Average Purchase Size': {
    id: 'Gunakan kategori kasar dulu: kecil, sedang, besar. Hindari meminta angka detail jika toko terlihat kurang nyaman.',
    en: 'Start with broad categories: small, medium, or large. Avoid asking for exact numbers if the store seems uncomfortable.',
    zh: '先用粗略类别：小、中、大。如果门店不太愿意，请避免追问具体金额。',
  },
  'Estimated Monthly Purchase Value': {
    id: 'Jika toko nyaman menjawab angka, pilih range bulanan. Jika tidak, cukup gunakan kategori ukuran pembelian.',
    en: 'If the store is comfortable sharing numbers, choose a monthly range. If not, use the purchase-size category instead.',
    zh: '如果门店愿意提供金额，可选择月采购区间；若不方便，则只记录采购规模类别即可。',
  },
  'Q33. Payment Method': {
    id: 'Tanyakan santai: transfer dulu, COD, tempo, atau campuran. Jelaskan bahwa jawaban boleh kategori saja.',
    en: 'Ask casually: transfer first, COD, credit term, or mixed. Make it clear that a category answer is enough.',
    zh: '自然询问：先转账、货到付款、账期，还是混合。说明只需选择类别即可。',
  },
  'Margin Expectation': {
    id: 'Gunakan sebagai sinyal komersial internal. Jangan membuat toko merasa sedang diminta membuka margin detail.',
    en: 'Use this as an internal commercial signal. Do not make the store feel pressured to reveal detailed margins.',
    zh: '这用于内部商业判断。不要让门店感觉被要求透露详细利润。',
  },
  'Current Order Method': {
    id: 'Tanyakan kebiasaan order saat stok habis: WA supplier, telepon, marketplace, sales datang, atau ambil sendiri.',
    en: 'Ask how they order when stock runs out: supplier WhatsApp, phone call, marketplace, visiting sales, or self pickup.',
    zh: '询问缺货时如何下单：供应商 WhatsApp、电话、电商平台、销售上门，还是自己取货。',
  },
  'Q34. Main Purchase Driver': {
    id: 'Pilih maksimal tiga alasan paling penting. Bantu toko memilih: harga, margin, kualitas, stok lengkap, retur, tempo, atau pengiriman.',
    en: 'Choose up to three most important reasons. Help the store compare price, margin, quality, availability, returns, terms, and delivery.',
    zh: '最多选择三个最重要原因。可引导门店比较价格、利润、质量、库存、退货、账期和配送。',
  },
  'Q35. Store Price Sensitivity': {
    id: 'Tanyakan apakah pelanggan lebih sensitif harga atau masih menimbang brand dan kualitas. Ini menentukan angle penawaran.',
    en: 'Ask whether customers are mostly price-sensitive or still weigh brand and quality. This shapes the offer angle.',
    zh: '询问客户主要看价格，还是也重视品牌和质量。这会影响后续报价切入点。',
  },
  'Q36. Openness to New Alternative Brand': {
    id: 'Uji keterbukaan tanpa menjual keras: "Kalau ada supplier baru dengan harga lebih kompetitif dan barang lengkap, toko terbuka coba?"',
    en: 'Test openness without hard selling: "If a new supplier offers more competitive prices and complete items, would the store be open to trying?"',
    zh: '不强推地测试开放度：“如果有新供应商价格更有竞争力、货品更完整，门店愿意尝试吗？”',
  },
  'Q37. Main Reason to Try New Supplier': {
    id: 'Cari pesan follow-up terbaik: harga, margin, stok lengkap, tempo, retur, pengiriman, atau kualitas stabil.',
    en: 'Identify the strongest follow-up message: price, margin, complete stock, terms, returns, delivery, or stable quality.',
    zh: '找出最有效的后续沟通卖点：价格、利润、库存完整、账期、退货、配送或质量稳定。',
  },
  'Q38. Willingness to Receive Follow-up': {
    id: 'Tutup dengan izin follow-up: katalog dulu, info harga lewat WA, bicara owner, atau belum tertarik saat ini.',
    en: 'Close by asking follow-up permission: catalogue first, pricing via WhatsApp, speak with owner, or not interested right now.',
    zh: '最后确认跟进意愿：先发目录、通过 WhatsApp 发价格、与店主沟通，或目前不感兴趣。',
  },
  'Q39. Foto Tampak Depan Toko': {
    id: 'Minta izin singkat: "Saya izin foto tampak depan toko untuk bukti kunjungan ya Pak/Bu."',
    en: 'Ask briefly: "May I take a storefront photo as visit evidence?"',
    zh: '简短征求同意：“我可以拍一张门头照片作为拜访凭证吗？”',
  },
  'Q40. Foto Dalam Toko / Rak': {
    id: 'Tekankan bahwa foto hanya area rak umum untuk validasi kategori barang, bukan audit atau data sensitif.',
    en: 'Emphasize that the photo is only of the general shelf area to validate product category, not an audit or sensitive data capture.',
    zh: '请说明照片只拍普通货架区域，用于验证商品类别，不是审计，也不会拍敏感资料。',
  },
  'Alasan foto dalam/rak kosong': {
    id: 'Jika toko menolak foto dalam, hormati keputusan mereka dan pilih alasan yang paling sesuai.',
    en: 'If the store refuses an interior photo, respect the decision and choose the most accurate reason.',
    zh: '如果门店拒绝拍摄内部照片，请尊重对方并选择最准确的原因。',
  },
  'Q41. Foto dengan Narasumber / PIC': {
    id: 'Minta dengan sopan. Jika tidak berkenan, jangan dipaksa; cukup catat alasan refusal.',
    en: 'Ask politely. If they are not comfortable, do not push; simply record the refusal reason.',
    zh: '请礼貌询问。如对方不愿意，不要强求；记录拒绝原因即可。',
  },
  'Alasan foto PIC kosong': {
    id: 'Gunakan alasan ini jika foto dengan narasumber tidak bisa diambil karena penolakan, kondisi toko ramai, atau privasi.',
    en: 'Use this reason when a PIC photo cannot be taken because of refusal, a busy store condition, or privacy concerns.',
    zh: '若因拒绝、门店繁忙或隐私原因无法拍联系人照片，请在此选择原因。',
  },
  'Q42. Surveyor notes': {
    id: 'Tulis setelah percakapan. Catat hal penting yang tidak masuk pilihan, seperti minat produk tertentu, keluhan supplier, atau permintaan follow-up.',
    en: 'Write this after the conversation. Capture important details that do not fit the options, such as product interest, supplier complaints, or follow-up requests.',
    zh: '请在对话后填写。记录选项无法覆盖的重要信息，例如特定产品兴趣、供应商问题或跟进请求。',
  },
};

type SurveyFormState = {
  storeAlias: string;
  visitOutcome: string;
  plannedOrUnplanned: '' | 'PLANNED' | 'UNPLANNED';
  latitude: string;
  longitude: string;
  gpsAccuracy: number;
  gpsDistanceFromTarget: number;
  gpsWarningFlag: boolean;
  addressDetail: string;
  landmark: string;
  contactPersonName: string;
  picType: string;
  whatsappNumber: string;
  waEmptyReason: string;
  purchasingDecisionMaker: string;
  decisionMakerAvailability: string;
  businessType: string;
  vehicleSpecialization: string[];
  storeScale: string;
  coolingProducts: string[];
  coolingShelfSize: string;
  coolingSalesActivity: string;
  coolingBrands: string[];
  otherCoolingBrand: string;
  productSellingSegment: string;
  lowCostImportShare: string;
  supplierType: string[];
  supplierName: string;
  supplierDependency: string;
  supplierSatisfaction: string;
  returnEase: string;
  deliverySpeed: string;
  paymentMethod: string;
  restockFrequency: string;
  purchaseSizeRange: string;
  monthlyPurchaseValue: string;
  marginExpectation: string;
  currentOrderMethod: string[];
  mainPurchaseDriver: string[];
  priceSensitivity: string;
  opennessToNewSupplier: string;
  reasonToTryNewSupplier: string[];
  willingnessToReceiveFollowUp: string;
  storefrontPhotoUrl: string;
  interiorPhotoUrl: string;
  picPhotoUrl: string;
  interiorPhotoMissingReason: string;
  picPhotoMissingReason: string;
  surveyorNotes: string;
};

const defaultSurveyForm: SurveyFormState = {
  storeAlias: '',
  visitOutcome: '',
  plannedOrUnplanned: '',
  latitude: '',
  longitude: '',
  gpsAccuracy: 0,
  gpsDistanceFromTarget: 0,
  gpsWarningFlag: false,
  addressDetail: '',
  landmark: '',
  contactPersonName: '',
  picType: '',
  whatsappNumber: '',
  waEmptyReason: '',
  purchasingDecisionMaker: '',
  decisionMakerAvailability: '',
  businessType: '',
  vehicleSpecialization: [],
  storeScale: '',
  coolingProducts: [],
  coolingShelfSize: '',
  coolingSalesActivity: '',
  coolingBrands: [],
  otherCoolingBrand: '',
  productSellingSegment: '',
  lowCostImportShare: '',
  supplierType: [],
  supplierName: '',
  supplierDependency: '',
  supplierSatisfaction: '',
  returnEase: '',
  deliverySpeed: '',
  paymentMethod: '',
  restockFrequency: '',
  purchaseSizeRange: '',
  monthlyPurchaseValue: '',
  marginExpectation: '',
  currentOrderMethod: [],
  mainPurchaseDriver: [],
  priceSensitivity: '',
  opennessToNewSupplier: '',
  reasonToTryNewSupplier: [],
  willingnessToReceiveFollowUp: '',
  storefrontPhotoUrl: '',
  interiorPhotoUrl: '',
  picPhotoUrl: '',
  interiorPhotoMissingReason: '',
  picPhotoMissingReason: '',
  surveyorNotes: '',
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Foto gagal dibaca.'));
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  });
}

async function cameraFileToEvidenceDataUrl(file: File) {
  const sourceDataUrl = await fileToDataUrl(file);
  if (!sourceDataUrl.startsWith('data:image/')) throw new Error('File harus berupa foto dari kamera perangkat.');

  const image = new Image();
  const imageLoaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Foto kamera tidak bisa diproses.'));
  });
  image.src = sourceDataUrl;
  await imageLoaded;

  const maxWidth = 1280;
  const ratio = Math.min(1, maxWidth / image.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.naturalWidth * ratio);
  canvas.height = Math.round(image.naturalHeight * ratio);
  const context = canvas.getContext('2d');
  if (!context) return sourceDataUrl;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}

function groupAssignmentRows(rows: AssignmentRow[]) {
  return rows.reduce<Record<string, Record<string, Record<string, Record<string, AssignmentRow[]>>>>>((provinceGroups, row) => {
    provinceGroups[row.province] ??= {};
    provinceGroups[row.province][row.city] ??= {};
    provinceGroups[row.province][row.city][row.district] ??= {};
    provinceGroups[row.province][row.city][row.district][row.village] ??= [];
    provinceGroups[row.province][row.city][row.district][row.village].push(row);
    return provinceGroups;
  }, {});
}

function groupSurveysBySurveyor(rows: SurveyHistoryItem[]) {
  return rows.reduce<Record<string, SurveyHistoryItem[]>>((groups, row) => {
    groups[row.surveyorName] ??= [];
    groups[row.surveyorName].push(row);
    return groups;
  }, {});
}

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function languageLocale(language: AppLanguage) {
  if (language === 'en') return 'en-US';
  if (language === 'zh') return 'zh-CN';
  return 'id-ID';
}

function surveyTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatSurveyHistoryDate(value: string, language: AppLanguage) {
  const timestamp = surveyTimestamp(value);
  if (!timestamp) return '-';
  return new Intl.DateTimeFormat(languageLocale(language), {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

function formatSurveyHistoryTime(value: string, language: AppLanguage) {
  const timestamp = surveyTimestamp(value);
  if (!timestamp) return '-';
  return new Intl.DateTimeFormat(languageLocale(language), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function verificationStatusLabel(status: string, language: AppLanguage) {
  return i18nPhrases[status]?.[language] ?? status;
}

function dataQualityGradeLabel(grade: string, language: AppLanguage) {
  const labels: Record<string, SurveyHint> = {
    Good: { id: 'Baik', en: 'Good', zh: '\u826f\u597d' },
    Warning: { id: 'Perlu perhatian', en: 'Warning', zh: '\u9700\u8981\u5173\u6ce8' },
    Critical: { id: 'Kritis', en: 'Critical', zh: '\u4e25\u91cd' },
  };
  return labels[grade]?.[language] ?? grade;
}

function leadClassificationLabel(classification: string, language: AppLanguage) {
  const labels: Record<string, SurveyHint> = {
    'Hot Lead': { id: 'Hot Lead', en: 'Hot Lead', zh: '\u9ad8\u610f\u5411\u7ebf\u7d22' },
    'Qualified Lead': { id: 'Qualified Lead', en: 'Qualified Lead', zh: '\u5408\u683c\u7ebf\u7d22' },
    'Strategic Lead': { id: 'Lead Strategis', en: 'Strategic Lead', zh: '\u6218\u7565\u7ebf\u7d22' },
    'Normal Lead': { id: 'Lead Normal', en: 'Normal Lead', zh: '\u666e\u901a\u7ebf\u7d22' },
    'Visit Not Completed': { id: 'Kunjungan Tidak Selesai', en: 'Visit Not Completed', zh: '\u8bbf\u95ee\u672a\u5b8c\u6210' },
    'Prioritas Rendah': { id: 'Prioritas Rendah', en: 'Low Priority', zh: '\u4f4e\u4f18\u5148\u7ea7' },
    'Low Priority': { id: 'Prioritas Rendah', en: 'Low Priority', zh: '\u4f4e\u4f18\u5148\u7ea7' },
  };
  return labels[classification]?.[language] ?? classification;
}

function compactVisitOutcomeLabel(outcome: string, language: AppLanguage) {
  const normalized = outcome.toLowerCase().replace(/[_-]+/g, ' ');
  if (normalized.includes('completed') || normalized.includes('selesai')) {
    return localCopy(language, { id: 'Selesai', en: 'Completed', zh: '\u5df2\u5b8c\u6210' });
  }
  if (normalized.includes('closed') || normalized.includes('tutup')) {
    return localCopy(language, { id: 'Toko Tutup', en: 'Closed', zh: '\u95e8\u5e97\u5173\u95ed' });
  }
  if (normalized.includes('refused') || normalized.includes('tolak')) {
    return localCopy(language, { id: 'Ditolak', en: 'Refused', zh: '\u5df2\u62d2\u7edd' });
  }
  if (normalized.includes('not found') || normalized.includes('tidak ditemukan')) {
    return localCopy(language, { id: 'Tidak Ditemukan', en: 'Not Found', zh: '\u672a\u627e\u5230' });
  }
  return outcome;
}

function compactVerificationStatusLabel(status: string, language: AppLanguage) {
  const labels: Record<string, SurveyHint> = {
    VERIFIED_VALID: { id: 'Valid', en: 'Valid', zh: '\u6709\u6548' },
    WAITING_VERIFICATION: { id: 'Menunggu', en: 'Waiting', zh: '\u5f85\u5ba1\u6838' },
    WAITING_VERIFICATION_WARNING: { id: 'Perlu Cek', en: 'Needs Check', zh: '\u9700\u68c0\u67e5' },
    NEED_REVISION: { id: 'Revisi', en: 'Revision', zh: '\u9700\u4fee\u8ba2' },
    REJECTED_INVALID: { id: 'Ditolak', en: 'Rejected', zh: '\u5df2\u9a73\u56de' },
    MERGED_DUPLICATE: { id: 'Duplikat', en: 'Merged', zh: '\u5df2\u5408\u5e76' },
  };
  return labels[status]?.[language] ?? verificationStatusLabel(status, language);
}

function leadChipColor(classification: string) {
  if (classification === 'Hot Lead') return 'secondary' as const;
  if (['Qualified Lead', 'Strategic Lead'].includes(classification)) return 'primary' as const;
  if (['Prioritas Rendah', 'Low Priority'].includes(classification)) return 'default' as const;
  return 'info' as const;
}

function hasHistoryWarning(row: SurveyHistoryItem) {
  return (
    visibleVerificationWarningFlags(row).length > 0 ||
    row.gpsWarningFlag ||
    row.gpsDistanceFromTarget > 100 ||
    !row.storefrontPhotoUrl ||
    !row.interiorPhotoUrl ||
    !row.picPhotoUrl ||
    ['NEED_REVISION', 'REJECTED_INVALID'].includes(row.verificationStatus)
  );
}

function formatCount(value: number, language: AppLanguage) {
  return value.toLocaleString(languageLocale(language));
}

function surveyorHistoryStatusReason(kind: 'valid' | 'waiting' | 'revision', count: number, total: number, language: AppLanguage) {
  const percent = pct(count, total);
  if (kind === 'valid') {
    return localCopy(language, {
      id: `${formatCount(count, language)} Valid berarti ${percent} dari submit surveyor ini sudah disetujui verifikator dan masuk database toko valid.`,
      en: `${formatCount(count, language)} Valid means ${percent} of this surveyor's submissions have been approved by the verifier and counted as valid stores.`,
      zh: `${formatCount(count, language)} 个有效表示该调研员提交记录中的 ${percent} 已由审核员批准，并计入有效门店库。`,
    });
  }
  if (kind === 'waiting') {
    return localCopy(language, {
      id: `${formatCount(count, language)} Menunggu berarti ${percent} dari submit surveyor ini masih berada di antrean verifikasi dan belum menjadi data final.`,
      en: `${formatCount(count, language)} Waiting means ${percent} of this surveyor's submissions are still in the verification queue and are not final yet.`,
      zh: `${formatCount(count, language)} 个待审核表示该调研员提交记录中的 ${percent} 仍在审核队列中，尚未成为最终数据。`,
    });
  }
  return localCopy(language, {
    id: `${formatCount(count, language)} Revisi berarti ${percent} dari submit surveyor ini dikembalikan oleh verifikator karena ada bagian yang harus dilengkapi atau diperbaiki.`,
    en: `${formatCount(count, language)} Revision means ${percent} of this surveyor's submissions were returned by the verifier because some data must be completed or corrected.`,
    zh: `${formatCount(count, language)} 个需修订表示该调研员提交记录中的 ${percent} 被审核员退回，需要补充或修正。`,
  });
}

function surveyorHistoryWarningDetail(rows: SurveyHistoryItem[], language: AppLanguage) {
  const gps = rows.filter((row) => row.gpsWarningFlag || row.gpsDistanceFromTarget > 100).length;
  const photo = rows.filter((row) => !row.storefrontPhotoUrl || !row.interiorPhotoUrl || !row.picPhotoUrl).length;
  const status = rows.filter((row) => ['NEED_REVISION', 'REJECTED_INVALID'].includes(row.verificationStatus)).length;
  const duplicate = rows.filter(hasDuplicateWarning).length;
  const parts = [
    gps ? localCopy(language, { id: `${gps} GPS`, en: `${gps} GPS`, zh: `${gps} 个 GPS` }) : '',
    photo ? localCopy(language, { id: `${photo} foto`, en: `${photo} photo`, zh: `${photo} 个照片` }) : '',
    duplicate ? localCopy(language, { id: `${duplicate} duplikat`, en: `${duplicate} duplicate`, zh: `${duplicate} 个重复` }) : '',
    status ? localCopy(language, { id: `${status} status revisi/ditolak`, en: `${status} revision/rejected status`, zh: `${status} 个修订/驳回状态` }) : '',
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : localCopy(language, { id: 'tidak ada warning aktif', en: 'no active warnings', zh: '无活动预警' });
}

function surveyorHistorySummaryTooltip({
  kind,
  label,
  value,
  helper,
  rows,
  summary,
  language,
}: {
  kind: 'validRate' | 'hot' | 'warning' | 'averageScore';
  label: string;
  value: string;
  helper: string;
  rows: SurveyHistoryItem[];
  summary: {
    total: number;
    verified: number;
    hot: number;
    warning: number;
    avgMerchant: number;
    avgQuality: number;
    validRate: string;
  };
  language: AppLanguage;
}) {
  const explanations = {
    validRate: localCopy(language, {
      id: `${label} menunjukkan porsi submit surveyor yang sudah disetujui verifikator. Nilainya ${summary.validRate}: ${formatCount(summary.verified, language)} dari ${formatCount(summary.total, language)} submit sudah valid.`,
      en: `${label} shows the share of this surveyor's submissions approved by the verifier. The value is ${summary.validRate}: ${formatCount(summary.verified, language)} of ${formatCount(summary.total, language)} submissions are valid.`,
      zh: `${label} 表示该调研员提交记录中已由审核员批准的比例。当前为 ${summary.validRate}：${formatCount(summary.verified, language)} / ${formatCount(summary.total, language)} 个提交已有效。`,
    }),
    hot: localCopy(language, {
      id: `${label} adalah toko prioritas follow-up: Merchant Potential tinggi, terbuka mencoba supplier baru, dan nomor WhatsApp tersedia. Jumlahnya ${formatCount(summary.hot, language)} dari ${formatCount(summary.total, language)} submit.`,
      en: `${label} stores are follow-up priorities: high Merchant Potential, open to trying a new supplier, and WhatsApp available. There are ${formatCount(summary.hot, language)} of ${formatCount(summary.total, language)} submissions.`,
      zh: `${label} 是优先跟进门店：商户潜力高、愿意尝试新供应商且有 WhatsApp。数量为 ${formatCount(summary.hot, language)} / ${formatCount(summary.total, language)} 个提交。`,
    }),
    warning: localCopy(language, {
      id: `${label} menghitung submit yang perlu dicek lagi karena GPS, foto evidence, duplikat, atau status verifikasi. Rinciannya: ${surveyorHistoryWarningDetail(rows, language)}.`,
      en: `${label} counts submissions that need another check because of GPS, photo evidence, duplicate signals, or verification status. Detail: ${surveyorHistoryWarningDetail(rows, language)}.`,
      zh: `${label} 统计因 GPS、照片证据、重复信号或审核状态而需要复核的提交。详情：${surveyorHistoryWarningDetail(rows, language)}。`,
    }),
    averageScore: localCopy(language, {
      id: `${label} merangkum rata-rata Merchant Score dan Data Quality surveyor ini. Merchant Score menilai potensi bisnis; Data Quality menilai kelengkapan dan kepercayaan data.`,
      en: `${label} summarizes this surveyor's average Merchant Score and Data Quality. Merchant Score estimates business potential; Data Quality measures completeness and reliability.`,
      zh: `${label} 汇总该调研员的平均商户分数和数据质量。商户分数评估业务潜力；数据质量评估完整性和可信度。`,
    }),
  };

  return (
    <Box className="explain-tooltip-content">
      <Typography variant="caption" fontWeight={900}>
        {label}: {value}
      </Typography>
      <Typography variant="caption">{explanations[kind]}</Typography>
      <Typography variant="caption">{helper}</Typography>
    </Box>
  );
}

function historyVisitOutcomeReason(row: SurveyHistoryItem, language: AppLanguage) {
  if (row.visitOutcome.toLowerCase().includes('completed')) {
    return localCopy(language, {
      id: 'Selesai berarti survey toko berhasil dilakukan dan form dikirim ke backend untuk scoring serta verifikasi.',
      en: 'Completed means the store survey was finished and submitted to the backend for scoring and verification.',
      zh: '已完成表示门店调研已完成，并提交到后端进行评分和审核。',
    });
  }
  return localCopy(language, {
    id: `Status kunjungan ini adalah ${compactVisitOutcomeLabel(row.visitOutcome, language)}. Status dipakai untuk membedakan survey selesai, toko tutup, ditolak, tidak ditemukan, atau butuh revisit.`,
    en: `This visit status is ${compactVisitOutcomeLabel(row.visitOutcome, language)}. It distinguishes completed surveys, closed stores, refusals, not found stores, or revisit needs.`,
    zh: `本次拜访状态为 ${compactVisitOutcomeLabel(row.visitOutcome, language)}，用于区分已完成、关店、拒访、未找到或需复访。`,
  });
}

function historyLeadReason(row: SurveyHistoryItem, language: AppLanguage) {
  if (row.leadClassification === 'Hot Lead') {
    return localCopy(language, {
      id: 'Hot Lead diberikan karena Merchant Potential tinggi, toko terbuka untuk supplier baru, dan nomor WhatsApp tersedia untuk follow-up langsung.',
      en: 'Hot Lead is assigned because Merchant Potential is high, the store is open to a new supplier, and WhatsApp is available for direct follow-up.',
      zh: '高意向线索表示商户潜力高、愿意尝试新供应商，并且有 WhatsApp 可直接跟进。',
    });
  }
  if (row.leadClassification === 'Qualified Lead') {
    return localCopy(language, {
      id: 'Qualified Lead berarti potensi toko tinggi dan terbuka untuk supplier baru, tetapi belum memenuhi syarat Hot Lead karena nomor WA belum tersedia.',
      en: 'Qualified Lead means the store has high potential and is open to a new supplier, but it is not a Hot Lead yet because WA is not available.',
      zh: '合格线索表示门店潜力高且愿意尝试新供应商，但因 WA 尚不可用而未达到高意向线索。',
    });
  }
  return localCopy(language, {
    id: `${leadClassificationLabel(row.leadClassification, language)} dihitung dari Merchant Potential, relevansi cooling, openness terhadap supplier baru, dan kesiapan kontak follow-up.`,
    en: `${leadClassificationLabel(row.leadClassification, language)} is calculated from Merchant Potential, cooling relevance, openness to a new supplier, and follow-up contact readiness.`,
    zh: `${leadClassificationLabel(row.leadClassification, language)} 根据商户潜力、冷却品类相关性、对新供应商的开放度和跟进联系方式准备度计算。`,
  });
}

function historyScoreReason(row: SurveyHistoryItem, language: AppLanguage) {
  return localCopy(language, {
    id: `Merchant ${row.merchantGrade} (${row.merchantPotentialScore}/100) menilai potensi bisnis toko. DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)} (${row.dataQualityScore}/100) menilai kelengkapan data, GPS, kontak, foto evidence, dan konsistensi jawaban.`,
    en: `Merchant ${row.merchantGrade} (${row.merchantPotentialScore}/100) estimates store business potential. DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)} (${row.dataQualityScore}/100) measures data completeness, GPS, contact, photo evidence, and answer consistency.`,
    zh: `商户 ${row.merchantGrade}（${row.merchantPotentialScore}/100）评估门店业务潜力。DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)}（${row.dataQualityScore}/100）评估数据完整性、GPS、联系人、照片证据和答案一致性。`,
  });
}

function historyVerificationReason(row: SurveyHistoryItem, language: AppLanguage) {
  const notes = row.revisionRequest || row.verificationNotes;
  if (row.verificationStatus === 'VERIFIED_VALID') {
    return localCopy(language, {
      id: 'Valid berarti verifikator sudah menyetujui data ini sebagai record toko yang layak dipakai.',
      en: 'Valid means the verifier has approved this data as a usable store record.',
      zh: '有效表示审核员已批准该数据作为可用门店记录。',
    });
  }
  if (row.verificationStatus === 'WAITING_VERIFICATION' || row.verificationStatus === 'WAITING_VERIFICATION_WARNING') {
    return localCopy(language, {
      id: 'Menunggu berarti data sudah masuk backend tetapi belum diputuskan verifikator. Jika ada warning, data akan diprioritaskan untuk dicek.',
      en: 'Waiting means the data is already in the backend but has not been decided by the verifier. If warnings exist, it is prioritized for review.',
      zh: '待审核表示数据已进入后端但审核员尚未决定。如有预警，将优先复核。',
    });
  }
  if (row.verificationStatus === 'NEED_REVISION') {
    return localCopy(language, {
      id: `Revisi berarti data dikembalikan ke surveyor untuk diperbaiki. ${notes ? `Catatan: ${notes}` : 'Revision request wajib diisi oleh verifikator.'}`,
      en: `Revision means the data was returned to the surveyor for correction. ${notes ? `Note: ${notes}` : 'A revision request is required from the verifier.'}`,
      zh: `需修订表示数据被退回给调研员修正。${notes ? `备注：${notes}` : '审核员必须填写修订要求。'}`,
    });
  }
  return localCopy(language, {
    id: `${compactVerificationStatusLabel(row.verificationStatus, language)} adalah keputusan verifikasi saat ini untuk submit toko ini.`,
    en: `${compactVerificationStatusLabel(row.verificationStatus, language)} is the current verification decision for this store submission.`,
    zh: `${compactVerificationStatusLabel(row.verificationStatus, language)} 是该门店提交当前的审核决定。`,
  });
}

function surveyHistoryToForm(row: SurveyHistoryItem): SurveyFormState {
  const missingReasons = row.photoMissingReason
    .split('|')
    .map((reason) => reason.trim())
    .filter(Boolean);
  const fallbackMissingReason = missingReasons[0] ?? row.photoMissingReason;

  return {
    ...defaultSurveyForm,
    storeAlias: row.storeAlias ?? '',
    visitOutcome: row.visitOutcome,
    plannedOrUnplanned: row.plannedOrUnplanned,
    latitude: row.latitude,
    longitude: row.longitude,
    gpsAccuracy: row.gpsAccuracy,
    gpsDistanceFromTarget: row.gpsDistanceFromTarget,
    gpsWarningFlag: row.gpsWarningFlag,
    addressDetail: row.addressDetail,
    landmark: row.landmark,
    contactPersonName: row.contactPersonName,
    picType: row.picType,
    whatsappNumber: row.whatsappNumber,
    waEmptyReason: row.waEmptyReason,
    purchasingDecisionMaker: row.purchasingDecisionMaker,
    decisionMakerAvailability: row.decisionMakerAvailability,
    businessType: row.businessType,
    vehicleSpecialization: row.vehicleSpecialization,
    storeScale: row.storeScale,
    coolingProducts: row.coolingProducts,
    coolingShelfSize: row.coolingShelfSize,
    coolingSalesActivity: row.coolingSalesActivity,
    coolingBrands: row.coolingBrands,
    productSellingSegment: row.productSellingSegment,
    lowCostImportShare: row.lowCostImportShare,
    supplierType: row.supplierType,
    supplierName: row.supplierName,
    supplierDependency: row.supplierDependency,
    supplierSatisfaction: row.supplierSatisfaction,
    returnEase: row.returnEase,
    deliverySpeed: row.deliverySpeed,
    paymentMethod: row.paymentMethod,
    restockFrequency: row.restockFrequency,
    purchaseSizeRange: row.purchaseSizeRange,
    monthlyPurchaseValue: row.monthlyPurchaseValue,
    marginExpectation: row.marginExpectation,
    currentOrderMethod: row.currentOrderMethod,
    mainPurchaseDriver: row.mainPurchaseDriver,
    priceSensitivity: row.priceSensitivity,
    opennessToNewSupplier: row.opennessToNewSupplier,
    reasonToTryNewSupplier: row.reasonToTryNewSupplier,
    willingnessToReceiveFollowUp: row.willingnessToReceiveFollowUp,
    storefrontPhotoUrl: row.storefrontPhotoUrl,
    interiorPhotoUrl: row.interiorPhotoUrl,
    picPhotoUrl: row.picPhotoUrl,
    interiorPhotoMissingReason: row.interiorPhotoUrl ? '' : fallbackMissingReason,
    picPhotoMissingReason: row.picPhotoUrl ? '' : missingReasons[row.interiorPhotoUrl ? 0 : 1] ?? fallbackMissingReason,
    surveyorNotes: row.surveyorNotes,
  };
}

const surveyStatusPriority = ['NEED_REVISION', 'WAITING_VERIFICATION_WARNING', 'WAITING_VERIFICATION', 'VERIFIED_VALID', 'REJECTED_INVALID', 'MERGED_DUPLICATE'];

function groupSurveyHistoryByDateAndStatus(rows: SurveyHistoryItem[], language: AppLanguage) {
  const dateGroups = new Map<
    string,
    {
      dateKey: string;
      dateLabel: string;
      timestamp: number;
      statusGroups: Map<string, SurveyHistoryItem[]>;
    }
  >();

  rows.forEach((row) => {
    const timestamp = surveyTimestamp(row.submitTime);
    const dateKey = timestamp ? new Date(timestamp).toISOString().slice(0, 10) : 'unknown';
    const currentDateGroup =
      dateGroups.get(dateKey) ??
      {
        dateKey,
        dateLabel: formatSurveyHistoryDate(row.submitTime, language),
        timestamp,
        statusGroups: new Map<string, SurveyHistoryItem[]>(),
      };
    const currentStatusGroup = currentDateGroup.statusGroups.get(row.verificationStatus) ?? [];
    currentStatusGroup.push(row);
    currentDateGroup.statusGroups.set(row.verificationStatus, currentStatusGroup);
    dateGroups.set(dateKey, currentDateGroup);
  });

  return Array.from(dateGroups.values())
    .sort((left, right) => right.timestamp - left.timestamp)
    .map((dateGroup) => ({
      ...dateGroup,
      statusGroups: Array.from(dateGroup.statusGroups.entries())
        .map(([status, items]) => ({
          status,
          items: items.sort((left, right) => surveyTimestamp(right.submitTime) - surveyTimestamp(left.submitTime)),
        }))
        .sort((left, right) => {
          const leftPriority = surveyStatusPriority.indexOf(left.status);
          const rightPriority = surveyStatusPriority.indexOf(right.status);
          return (leftPriority === -1 ? 99 : leftPriority) - (rightPriority === -1 ? 99 : rightPriority);
        }),
    }));
}

function NoticeSnackbar({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  const language = useCurrentLanguage();
  return (
    <Snackbar open={Boolean(notice)} autoHideDuration={3200} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity={notice?.severity ?? 'info'} variant="filled" onClose={onClose}>
        {notice?.message ? translateInline(notice.message, language) : ''}
      </Alert>
    </Snackbar>
  );
}

function getSurveyHint(label: string, hintKey?: string) {
  return surveyQuestionHints[hintKey ?? label];
}

function SurveyHintButton({ hint }: { hint: SurveyHint }) {
  const language = useCurrentLanguage();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const copy = hintUiCopy[language];
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        className="survey-hint-button"
        aria-label={copy.action}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        data-no-i18n
      >
        <TipsAndUpdatesRoundedIcon fontSize="inherit" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { className: 'survey-hint-popover' } }}
      >
        <Box className="survey-hint-content" data-no-i18n>
          <Stack direction="row" spacing={1} alignItems="center" className="survey-hint-title">
            <TipsAndUpdatesRoundedIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight={900}>
              {copy.title}
            </Typography>
          </Stack>
          <Typography variant="body2">{hint[language]}</Typography>
        </Box>
      </Popover>
    </>
  );
}

type QuestionRequirement = 'required' | 'optional' | 'none';

function SurveyQuestionLabel({
  label,
  hint,
  strong = false,
  requirement = 'none',
  selectionNote,
}: {
  label: string;
  hint?: SurveyHint;
  strong?: boolean;
  requirement?: QuestionRequirement;
  selectionNote?: string;
}) {
  const requirementLabel = requirement === 'required' ? 'Wajib' : requirement === 'optional' ? 'Opsional' : '';

  return (
    <Stack direction="row" spacing={0.7} alignItems="center" flexWrap="wrap" useFlexGap className={`survey-question-label ${strong ? 'strong' : ''}`}>
      <Typography
        component="span"
        variant={strong ? 'body2' : 'overline'}
        color={strong ? 'text.primary' : 'text.secondary'}
        fontWeight={strong ? 900 : 800}
      >
        {label}
      </Typography>
      {requirementLabel && <Chip size="small" label={requirementLabel} className={`question-requirement-chip ${requirement}`} />}
      {selectionNote && <Chip size="small" label={selectionNote} className="question-selection-note" />}
      {hint && <SurveyHintButton hint={hint} />}
    </Stack>
  );
}

type HintedTextFieldProps = Omit<ComponentProps<typeof TextField>, 'label'> & {
  label: string;
  hintKey?: string;
  requirement?: QuestionRequirement;
};

function HintedTextField({ label, hintKey, className, requirement, ...props }: HintedTextFieldProps) {
  const hint = getSurveyHint(label, hintKey);

  return (
    <Stack spacing={0.7} className={`question-block text-question-block ${className ?? ''}`}>
      <SurveyQuestionLabel label={label} hint={hint} requirement={requirement ?? (props.required ? 'required' : 'none')} />
      <TextField {...props} />
    </Stack>
  );
}

function SingleChoiceChips({
  label,
  options,
  value,
  onChange,
  helper,
  hintKey,
  requirement = 'required',
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  hintKey?: string;
  requirement?: QuestionRequirement;
}) {
  const hint = getSurveyHint(label, hintKey);

  return (
    <Stack spacing={1} className="question-block">
      <SurveyQuestionLabel label={label} hint={hint} requirement={requirement} />
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onClick={() => onChange(option)}
            color={value === option ? 'primary' : 'default'}
            variant={value === option ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>
      {helper && (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      )}
    </Stack>
  );
}

function multiChoiceOptionDescription(questionLabel: string, option: string, language: AppLanguage) {
  if (/vehicle specialization/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika toko rutin melayani segmen ${option} atau stoknya memang relevan untuk kendaraan tersebut.`,
      en: `Select this if the store regularly serves the ${option} segment or keeps relevant stock for it.`,
      zh: `如果门店经常服务 ${option} 细分车型，或库存与该车型相关，请选择此项。`,
    });
  }
  if (/cooling products/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika ${option} terlihat di toko atau disebut aktif dijual oleh narasumber.`,
      en: `Select this if ${option} is visible in the store or mentioned as actively sold by the respondent.`,
      zh: `如果店内可见 ${option}，或受访人说明该产品正在销售，请选择此项。`,
    });
  }
  if (/cooling brands/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika brand ${option} terlihat pada stok, kemasan, nota, atau disebut sebagai brand yang biasa dijual.`,
      en: `Select this if ${option} appears in stock, packaging, invoices, or is mentioned as a commonly sold brand.`,
      zh: `如果库存、包装、单据中可见 ${option}，或被提及为常售品牌，请选择此项。`,
    });
  }
  if (/supplier type/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika ${option} adalah salah satu sumber pasokan yang saat ini dipakai toko.`,
      en: `Select this if ${option} is one of the supply sources the store currently uses.`,
      zh: `如果 ${option} 是门店当前使用的供货来源之一，请选择此项。`,
    });
  }
  if (/current order method/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika toko saat ini biasa membuat pesanan melalui ${option}.`,
      en: `Select this if the store currently places orders through ${option}.`,
      zh: `如果门店目前通常通过 ${option} 下单，请选择此项。`,
    });
  }
  if (/main purchase driver/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika ${option} termasuk alasan utama toko memilih supplier atau produk.`,
      en: `Select this if ${option} is one of the main reasons the store chooses a supplier or product.`,
      zh: `如果 ${option} 是门店选择供应商或产品的主要原因之一，请选择此项。`,
    });
  }
  if (/reason to try new supplier/i.test(questionLabel)) {
    return localCopy(language, {
      id: `Pilih jika ${option} dapat menjadi alasan yang realistis bagi toko untuk mencoba supplier baru.`,
      en: `Select this if ${option} is a realistic reason for the store to try a new supplier.`,
      zh: `如果 ${option} 是门店尝试新供应商的现实原因，请选择此项。`,
    });
  }
  return localCopy(language, {
    id: `Pilih jika ${option} benar-benar sesuai dengan jawaban narasumber atau bukti yang terlihat di toko.`,
    en: `Select this if ${option} truly matches the respondent's answer or visible store evidence.`,
    zh: `如果 ${option} 确实符合受访人回答或店内可见证据，请选择此项。`,
  });
}

function MultiChoiceChips({
  label,
  options,
  value,
  onChange,
  max,
  helper,
  hintKey,
  requirement = 'required',
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
  helper?: string;
  hintKey?: string;
  requirement?: QuestionRequirement;
}) {
  const language = useCurrentLanguage();
  const hint = getSurveyHint(label, hintKey);
  const selectionNote = max ? `Bisa pilih >1 - maks. ${max}` : 'Bisa pilih >1';
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    if (max && value.length >= max) return;
    onChange([...value, option]);
  };

  return (
    <Stack spacing={1} className="question-block">
      <SurveyQuestionLabel label={label} hint={hint} requirement={requirement} selectionNote={selectionNote} />
      <Stack direction="row" flexWrap="wrap" useFlexGap gap={1} className="multi-choice-grid multi-choice-compact">
        {options.map((option) => {
          const selected = value.includes(option);
          const description = multiChoiceOptionDescription(label, option, language);
          return (
            <Chip
              key={option}
              label={option}
              title={description}
              clickable
              color={selected ? 'primary' : 'default'}
              variant={selected ? 'filled' : 'outlined'}
              onClick={() => toggle(option)}
            />
          );
        })}
      </Stack>
      {(helper || max) && (
        <Typography variant="caption" color="text.secondary">
          {helper ?? `Maksimal ${max} pilihan.`} {value.length ? `${value.length} dipilih.` : ''}
        </Typography>
      )}
    </Stack>
  );
}

function EvidenceTile({
  label,
  value,
  onCapture,
  onClear,
  required,
  hintKey,
}: {
  label: string;
  value: string;
  onCapture: (value: string) => void;
  onClear: () => void;
  required?: boolean;
  hintKey?: string;
}) {
  const hint = getSurveyHint(label, hintKey);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const openNativeCamera = () => {
    setCameraError('');
    if (inputRef.current) inputRef.current.value = '';
    inputRef.current?.click();
  };

  const handleNativeCameraResult = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCameraError('File harus berupa foto dari kamera perangkat.');
      return;
    }
    setUploading(true);
    setCameraError('');
    try {
      const dataUrl = await cameraFileToEvidenceDataUrl(file);
      const result = await api.uploadEvidence({ photoType: label, dataUrl });
      onCapture(result.url);
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : 'Foto kamera gagal disimpan.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper className={`photo-evidence-tile ${value ? 'ok' : required ? 'required' : ''}`}>
      <PhotoCameraRoundedIcon color={value ? 'primary' : 'inherit'} />
      <Box minWidth={0}>
        <SurveyQuestionLabel label={label} hint={hint} strong requirement={required ? 'required' : 'optional'} />
        <Typography variant="caption" color={cameraError ? 'error' : 'text.secondary'} noWrap>
          {cameraError || (value ? 'Foto kamera tersimpan di backend' : required ? 'Wajib untuk Survey Completed' : 'Buka kamera perangkat untuk mengambil foto')}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="native-camera-input"
          onChange={handleNativeCameraResult}
        />
        <Button size="small" variant={value ? 'outlined' : 'contained'} startIcon={<PhotoCameraRoundedIcon />} onClick={openNativeCamera} disabled={uploading}>
          {uploading ? 'Menyimpan...' : value ? 'Ganti' : 'Capture'}
        </Button>
        {value && (
          <Button size="small" color="warning" onClick={onClear} disabled={uploading}>
            Hapus
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

function getVisibleNavItems(role: Role) {
  return navItems.filter((item) => !item.hidden && item.roles.includes(role));
}

function canAccessView(role: Role, view: ViewKey) {
  return Boolean(navItems.find((item) => item.key === view && item.roles.includes(role)));
}

function viewKeyFromNotification(value: string): ViewKey | null {
  return navItems.some((item) => item.key === value) ? (value as ViewKey) : null;
}

function notificationChipColor(severity: NotificationItem['severity']): ComponentProps<typeof MuiChip>['color'] {
  if (severity === 'success') return 'success';
  if (severity === 'warning') return 'warning';
  if (severity === 'error') return 'error';
  return 'primary';
}

function metricCardDetail(label: string, value: string, helper: string, language: AppLanguage) {
  if (/submitted visits/i.test(label)) {
    return localCopy(language, {
      id: `${value} adalah total laporan kunjungan yang sudah masuk ke backend pada scope aktif. Metrik ini menunjukkan progres coverage campaign terhadap target 5.000 toko.`,
      en: `${value} is the total submitted visit reports in the active scope. This metric shows campaign coverage progress against the 5,000-store target.`,
      zh: `${value} 是当前范围内已提交的拜访报告总数。该指标显示相对 5,000 家门店目标的覆盖进度。`,
    });
  }
  if (/verified valid/i.test(label)) {
    return localCopy(language, {
      id: `${value} laporan sudah disetujui verifikator sebagai data valid. ${helper} dihitung dari laporan valid dibanding seluruh submit yang terlihat.`,
      en: `${value} reports have been approved by verifiers as valid data. ${helper} is calculated from valid reports divided by visible submissions.`,
      zh: `${value} 条报告已被审核员确认有效。${helper} 由有效报告数除以当前可见提交数计算。`,
    });
  }
  if (/hot leads/i.test(label)) {
    return localCopy(language, {
      id: `${value} toko diklasifikasikan sebagai Hot Lead oleh scoring backend, biasanya karena potensi tinggi, terbuka untuk follow-up, dan memiliki kontak WA/PIC yang bisa dihubungi.`,
      en: `${value} stores are classified as Hot Leads by backend scoring, usually because they show high potential, follow-up openness, and reachable WhatsApp/PIC contact.`,
      zh: `${value} 家门店被后端评分归类为高意向线索，通常因为潜力高、愿意跟进且有可联系的 WhatsApp/PIC。`,
    });
  }
  if (/warnings/i.test(label)) {
    return localCopy(language, {
      id: `${value} laporan memiliki sinyal risiko seperti GPS jauh, foto belum lengkap, indikasi duplikat, revisi, atau data yang perlu dicek sebelum dipakai untuk keputusan.`,
      en: `${value} reports contain risk signals such as distant GPS, incomplete photos, duplicate indication, revision, or data that needs review before decision use.`,
      zh: `${value} 条报告包含风险信号，例如 GPS 偏离、照片不完整、疑似重复、修订或决策前需复核的数据。`,
    });
  }

  return localCopy(language, {
    id: `${value} merangkum metrik operasional pada kartu ini. ${helper} memberi konteks tambahan agar angka mudah dibaca sebelum membuka detail data.`,
    en: `${value} summarizes the operational metric on this card. ${helper} adds context so the number is easier to read before opening data details.`,
    zh: `${value} 汇总此卡片上的运营指标。${helper} 提供额外说明，便于在打开明细前理解数值。`,
  });
}

const dashboardMetricLabelByKey: Record<DashboardMetricKey, string> = {
  submitted: 'Submitted visits',
  verified: 'Verified valid',
  hot: 'Hot leads',
  warnings: 'Warnings',
};

function dashboardMetricTitle(metric: DashboardMetricKey, language: AppLanguage) {
  return translateInline(dashboardMetricLabelByKey[metric], language);
}

function dashboardMetricTone(metric: DashboardMetricKey) {
  if (metric === 'submitted') return '#2fd0a8';
  if (metric === 'verified') return '#61c8ff';
  if (metric === 'hot') return '#f5c84c';
  return '#ff8b73';
}

function dashboardMetricDescription(metric: DashboardMetricKey, language: AppLanguage) {
  if (metric === 'submitted') {
    return localCopy(language, {
      id: 'Menampilkan seluruh toko yang sudah disubmit, dikelompokkan per surveyor. Expand surveyor untuk memuat toko miliknya.',
      en: 'Shows all submitted stores grouped by surveyor. Expand a surveyor to load their stores.',
      zh: '显示按调研员分组的所有已提交门店。展开调研员后加载其门店。',
    });
  }
  if (metric === 'verified') {
    return localCopy(language, {
      id: 'Menampilkan toko yang sudah diputuskan valid oleh verifikator.',
      en: 'Shows stores that have been approved as valid by verifiers.',
      zh: '显示已被审核员确认有效的门店。',
    });
  }
  if (metric === 'hot') {
    return localCopy(language, {
      id: 'Menampilkan toko dengan klasifikasi Hot Lead untuk prioritas follow-up.',
      en: 'Shows stores classified as Hot Lead for follow-up priority.',
      zh: '显示被归类为高意向线索、优先跟进的门店。',
    });
  }
  return localCopy(language, {
    id: 'Menampilkan toko yang memiliki warning GPS, foto, duplikat, revisi, atau risiko data lain.',
    en: 'Shows stores with GPS, photo, duplicate, revision, or other data-risk warnings.',
    zh: '显示存在 GPS、照片、重复、修订或其他数据风险预警的门店。',
  });
}

function dashboardMetricStoreCacheKey(metric: DashboardMetricKey, surveyorId: string) {
  return `${metric}:${surveyorId}`;
}

type DashboardTimeSeriesOptionalKey = Exclude<DashboardMetricKey, 'submitted'>;
type DashboardTimeSeriesViewPoint = DashboardTimeSeriesPoint & {
  dateLabel: string;
  shortLabel: string;
  timestamp: number;
};

const dashboardTimeSeriesOptionalKeys: DashboardTimeSeriesOptionalKey[] = ['verified', 'hot', 'warnings'];
const dashboardTimeSeriesKeys: DashboardMetricKey[] = ['submitted', ...dashboardTimeSeriesOptionalKeys];
const emptyDashboardTimeSeriesToggles: Record<DashboardTimeSeriesOptionalKey, boolean> = {
  verified: false,
  hot: false,
  warnings: false,
};

function dateKeyToJakartaDate(dateKey: string) {
  return new Date(`${dateKey}T12:00:00+07:00`);
}

function formatDashboardTimeSeriesDate(dateKey: string, language: AppLanguage, compact = false) {
  const date = dateKeyToJakartaDate(dateKey);
  return new Intl.DateTimeFormat(languageLocale(language), {
    timeZone: 'Asia/Jakarta',
    weekday: compact ? undefined : 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
}

function decorateDashboardTimeSeriesPoints(points: DashboardTimeSeriesPoint[], language: AppLanguage): DashboardTimeSeriesViewPoint[] {
  return points.map((point) => ({
    ...point,
    dateLabel: formatDashboardTimeSeriesDate(point.dateKey, language),
    shortLabel: formatDashboardTimeSeriesDate(point.dateKey, language, true),
    timestamp: dateKeyToJakartaDate(point.dateKey).getTime(),
  }));
}

function dashboardTimeSeriesDisplayValue(points: DashboardTimeSeriesViewPoint[], metric: DashboardMetricKey, mode: DashboardTimeSeriesMode) {
  if (!points.length) return 0;
  if (mode === 'target') return points[points.length - 1][metric];
  return points.reduce((sum, point) => sum + point[metric], 0);
}

type SupplierSignalKey = 'supplierDissatisfaction' | 'lowCostImportAcceptance' | 'ownerReachable' | 'photoEvidenceComplete';
type SupplierSignalTone = 'primary' | 'warning' | 'info' | 'success';
type SupplierSignalSummary = {
  key: SupplierSignalKey;
  label: string;
  caption: string;
  insight: string;
  tone: SupplierSignalTone;
  color: string;
  count: number;
  total: number;
  rate: number;
  recentCount: number;
  recentTotal: number;
  recentRate: number;
  topCityLabel: string;
  rows: SurveyHistoryItem[];
};

type SupplierSignalDefinition = {
  label: string;
  caption: string;
  insight: string;
  tone: SupplierSignalTone;
  color: string;
  match: (row: SurveyHistoryItem) => boolean;
};

type LeadMixSummary = {
  label: string;
  color: string;
  count: number;
  total: number;
  rate: number;
  avgMerchant: number;
  avgQuality: number;
  warningCount: number;
  topCityLabel: string;
  latestSubmitTime: string;
  rows: SurveyHistoryItem[];
};

const supplierSignalDefinitions: Record<SupplierSignalKey, SupplierSignalDefinition> = {
  supplierDissatisfaction: {
    label: 'Supplier dissatisfaction',
    caption: 'Toko yang memberi sinyal keluhan atau sedang mencari alternatif supplier.',
    insight: 'Prioritas untuk pitching supplier baru, harga lebih kompetitif, dan SLA pengiriman.',
    tone: 'warning',
    color: '#f5c84c',
    match: (row) => ['Banyak keluhan', 'Kurang puas', 'Sedang cari alternatif'].includes(row.supplierSatisfaction),
  },
  lowCostImportAcceptance: {
    label: 'Low cost import acceptance',
    caption: 'Toko yang terbuka terhadap opsi import ekonomis atau campuran.',
    insight: 'Menunjukkan ruang untuk positioning produk value-for-money dan margin.',
    tone: 'primary',
    color: '#2fd0a8',
    match: (row) => ['Sedang', 'Tinggi', 'Campuran', 'Dominan'].includes(row.lowCostImportShare),
  },
  ownerReachable: {
    label: 'Owner reachable',
    caption: 'Toko dengan nomor yang sudah dicek bisa ditelepon atau dihubungi via WhatsApp.',
    insight: 'Menentukan kesiapan follow-up tanpa perlu enrichment kontak tambahan.',
    tone: 'info',
    color: '#61c8ff',
    match: (row) => isVerifiedWaReachable(row) || isVerifiedPhoneCallable(row),
  },
  photoEvidenceComplete: {
    label: 'Photo evidence complete',
    caption: 'Survey dengan foto depan, rak/interior, dan PIC lengkap.',
    insight: 'Mengukur readiness data untuk verifikasi dan audit evidence.',
    tone: 'success',
    color: '#81c784',
    match: (row) => Boolean(row.storefrontPhotoUrl && row.interiorPhotoUrl && row.picPhotoUrl),
  },
};

const supplierSignalKeys: SupplierSignalKey[] = ['supplierDissatisfaction', 'lowCostImportAcceptance', 'ownerReachable', 'photoEvidenceComplete'];
const leadMixOrder = ['Hot Lead', 'Qualified Lead', 'Strategic Lead', 'Normal Lead', 'Low Priority', 'Visit Not Completed'];
const leadMixColors: Record<string, string> = {
  'Hot Lead': '#f5c84c',
  'Qualified Lead': '#2fd0a8',
  'Strategic Lead': '#61c8ff',
  'Normal Lead': '#7da4ff',
  'Low Priority': '#8c9391',
  'Visit Not Completed': '#ff8b73',
};

function topCityLabel(rows: SurveyHistoryItem[]) {
  if (!rows.length) return '-';
  return Object.entries(
    rows.reduce<Record<string, number>>((counts, row) => {
      const city = row.city || 'Tidak diketahui';
      counts[city] = (counts[city] ?? 0) + 1;
      return counts;
    }, {}),
  )
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 2)
    .map(([city, count]) => `${city} ${count}`)
    .join(', ');
}

function leadMixColor(label: string) {
  return leadMixColors[label] ?? '#b28cff';
}

function leadMixSortIndex(label: string) {
  const index = leadMixOrder.indexOf(label);
  return index >= 0 ? index : leadMixOrder.length;
}

function buildLeadMixSummaries(rows: SurveyHistoryItem[]): LeadMixSummary[] {
  const total = rows.length;
  const grouped = rows.reduce<Map<string, SurveyHistoryItem[]>>((groups, row) => {
    const label = row.leadClassification || 'Unclassified';
    const current = groups.get(label) ?? [];
    current.push(row);
    groups.set(label, current);
    return groups;
  }, new Map());

  return Array.from(grouped.entries())
    .map(([label, groupRows]) => {
      const sortedRows = [...groupRows].sort((left, right) => surveyTimestamp(right.submitTime) - surveyTimestamp(left.submitTime));
      const avgMerchant = groupRows.length ? Math.round(groupRows.reduce((sum, row) => sum + row.merchantPotentialScore, 0) / groupRows.length) : 0;
      const avgQuality = groupRows.length ? Math.round(groupRows.reduce((sum, row) => sum + row.dataQualityScore, 0) / groupRows.length) : 0;
      const latestRow = sortedRows[0];
      return {
        label,
        color: leadMixColor(label),
        count: groupRows.length,
        total,
        rate: total ? Math.round((groupRows.length / total) * 100) : 0,
        avgMerchant,
        avgQuality,
        warningCount: groupRows.filter(hasHistoryWarning).length,
        topCityLabel: topCityLabel(groupRows),
        latestSubmitTime: latestRow?.submitTime ?? '',
        rows: sortedRows,
      };
    })
    .sort((left, right) => leadMixSortIndex(left.label) - leadMixSortIndex(right.label) || right.count - left.count || left.label.localeCompare(right.label));
}

function buildSupplierSignalSummaries(rows: SurveyHistoryItem[]): SupplierSignalSummary[] {
  const total = rows.length;
  const latestTimestamp = rows.reduce((latest, row) => Math.max(latest, surveyTimestamp(row.submitTime)), 0);
  const recentSince = latestTimestamp ? latestTimestamp - 6 * 86_400_000 : 0;
  const recentRows = recentSince ? rows.filter((row) => surveyTimestamp(row.submitTime) >= recentSince) : [];
  const sortedRows = [...rows].sort((left, right) => surveyTimestamp(right.submitTime) - surveyTimestamp(left.submitTime));

  return supplierSignalKeys.map((key) => {
    const definition = supplierSignalDefinitions[key];
    const matchedRows = sortedRows.filter(definition.match);
    const recentMatchedRows = recentRows.filter(definition.match);
    return {
      key,
      label: definition.label,
      caption: definition.caption,
      insight: definition.insight,
      tone: definition.tone,
      color: definition.color,
      count: matchedRows.length,
      total,
      rate: total ? Math.round((matchedRows.length / total) * 100) : 0,
      recentCount: recentMatchedRows.length,
      recentTotal: recentRows.length,
      recentRate: recentRows.length ? Math.round((recentMatchedRows.length / recentRows.length) * 100) : 0,
      topCityLabel: topCityLabel(matchedRows),
      rows: matchedRows,
    };
  });
}

const verificationMetricLabelByKey: Record<VerificationMetricKey, string> = {
  pending: 'Belum Diverifikasi',
  surveyors: 'Surveyor Aktif',
  warning: 'Warning Queue',
  gps: 'GPS Warning',
  missingPhoto: 'Missing Photo',
  duplicate: 'Duplicate',
};

function verificationMetricTitle(metric: VerificationMetricKey, language: AppLanguage) {
  return translateInline(verificationMetricLabelByKey[metric], language);
}

function verificationMetricTone(metric: VerificationMetricKey) {
  if (metric === 'pending') return '#61c8ff';
  if (metric === 'surveyors') return '#2fd0a8';
  if (metric === 'warning') return '#f5c84c';
  if (metric === 'gps') return '#ff8b73';
  if (metric === 'missingPhoto') return '#b28cff';
  return '#7da4ff';
}

function verificationMetricDescription(metric: VerificationMetricKey, language: AppLanguage) {
  if (metric === 'pending') {
    return localCopy(language, {
      id: 'Semua toko yang masih berada di antrean WAITING_VERIFICATION atau WAITING_VERIFICATION_WARNING. Expand surveyor untuk memuat toko tertua lebih dulu.',
      en: 'All stores still in WAITING_VERIFICATION or WAITING_VERIFICATION_WARNING. Expand a surveyor to load the oldest stores first.',
      zh: '仍处于 WAITING_VERIFICATION 或 WAITING_VERIFICATION_WARNING 的所有门店。展开调研员后优先加载最旧门店。',
    });
  }
  if (metric === 'surveyors') {
    return localCopy(language, {
      id: 'Jumlah surveyor yang masih memiliki antrean verifikasi terbuka. Popup menampilkan beban kerja dan risiko per surveyor.',
      en: 'Surveyors that still have open verification queues. The popup shows workload and risk mix per surveyor.',
      zh: '仍有待审核队列的调研员数量。弹窗显示每位调研员的工作量和风险构成。',
    });
  }
  if (metric === 'warning') {
    return localCopy(language, {
      id: 'Toko dengan warning data yang perlu diprioritaskan, termasuk indikasi duplikat valid dari mesin matching terbaru.',
      en: 'Stores with data warnings that need priority review, including valid duplicate indications from the latest matching engine.',
      zh: '存在数据预警且需优先复核的门店，包括最新匹配引擎识别出的有效重复迹象。',
    });
  }
  if (metric === 'gps') {
    return localCopy(language, {
      id: 'Toko dengan koordinat jauh dari target atau flag GPS aktif, cocok untuk dicek lewat preview peta sebelum keputusan.',
      en: 'Stores with coordinates far from target or active GPS flags, suitable for map preview review before decision.',
      zh: '坐标偏离目标或 GPS 标记激活的门店，适合在决策前通过地图预览复核。',
    });
  }
  if (metric === 'missingPhoto') {
    return localCopy(language, {
      id: 'Toko dengan evidence foto belum lengkap atau warning foto hilang, sehingga perlu review visual sebelum disetujui.',
      en: 'Stores with incomplete photo evidence or missing-photo warnings, requiring visual review before approval.',
      zh: '照片凭证不完整或存在照片缺失预警的门店，批准前需要视觉复核。',
    });
  }
  return localCopy(language, {
    id: 'Toko yang benar-benar punya kandidat duplikat dari data terverifikasi. Angka ini memakai perhitungan kandidat merge, bukan badge statis.',
    en: 'Stores that truly have duplicate candidates from verified data. This uses merge-candidate calculations, not static badges.',
    zh: '确实与已验证数据存在重复候选的门店。该数值来自合并候选计算，而非静态徽章。',
  });
}

function verificationMetricTotalLabel(metric: VerificationMetricKey, total: number, language: AppLanguage) {
  const value = total.toLocaleString(languageLocale(language));
  return metric === 'surveyors' ? `${value} surveyor` : `${value} toko`;
}

function verificationMetricStoreCacheKey(metric: VerificationMetricKey, surveyorId: string) {
  return `verification:${metric}:${surveyorId}`;
}

function browserPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function pushSubscriptionToPayload(subscription: PushSubscription): PushSubscriptionPayload {
  const serialized = subscription.toJSON();
  if (!serialized.endpoint || !serialized.keys?.p256dh || !serialized.keys.auth) {
    throw new Error('Push subscription browser tidak lengkap.');
  }

  return {
    endpoint: serialized.endpoint,
    expirationTime: serialized.expirationTime ?? null,
    keys: {
      p256dh: serialized.keys.p256dh,
      auth: serialized.keys.auth,
    },
    userAgent: navigator.userAgent,
  };
}

function viewKeyFromUrl(value: string): ViewKey | null {
  try {
    const url = new URL(value, window.location.origin);
    return viewKeyFromNotification(url.searchParams.get('view') ?? '');
  } catch {
    return null;
  }
}

function initialViewForUser(role: Role) {
  const requestedView = viewKeyFromUrl(window.location.href);
  return requestedView && canAccessView(role, requestedView) ? requestedView : defaultViewForRole(role);
}

async function revokeCurrentPushSubscription() {
  if (!browserPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration('/');
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  await api.revokePushSubscription(subscription.endpoint).catch(() => undefined);
  await subscription.unsubscribe().catch(() => undefined);
}

function defaultViewForRole(role: Role): ViewKey {
  if (role === 'Surveyor') return 'surveyor';
  if (role === 'Verificator') return 'verification';
  return 'command';
}

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>('command');
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);

  useDomI18n(language);

  const changeLanguage = (nextLanguage: AppLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('klwt-language', nextLanguage);
  };

  useEffect(() => {
    let active = true;

    api
      .session()
      .then((session) => {
        if (!active) return;
        if (session.user) {
          setCurrentUser(session.user);
          setAuthenticated(true);
          setActiveView(initialViewForUser(session.user.role));
        }
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated || !currentUser) return undefined;
    const runPrefetch = () => api.prefetchForRole(currentUser.role);
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(runPrefetch, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timer = globalThis.setTimeout(runPrefetch, 1200);
    return () => globalThis.clearTimeout(timer);
  }, [authenticated, currentUser?.role]);

  useEffect(() => {
    if (!currentUser || !('serviceWorker' in navigator)) return undefined;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      const message = event.data as { type?: string; url?: string };
      if (message.type !== 'KLWT_NOTIFICATION_CLICK' || !message.url) return;
      const requestedView = viewKeyFromUrl(message.url);
      if (requestedView && canAccessView(currentUser.role, requestedView)) setActiveView(requestedView);
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
  }, [currentUser]);

  const role = currentUser?.role ?? 'Manager';

  if (loading) {
    return (
      <LanguageContext.Provider value={language}>
        <AnimatedLoading />
      </LanguageContext.Provider>
    );
  }

  if (!authenticated) {
    return (
      <LanguageContext.Provider value={language}>
        <LoginPage
          error={loginError}
          pending={loginPending}
          language={language}
          onLanguageChange={changeLanguage}
          onEnter={async (username, password) => {
            setLoginError('');
            setLoginPending(true);
            try {
              const result = await api.login(username, password);
              setCurrentUser(result.user);
              setAuthenticated(true);
              setActiveView(initialViewForUser(result.user.role));
            } catch (error) {
              setLoginError(error instanceof Error ? error.message : 'Login failed');
            } finally {
              setLoginPending(false);
            }
          }}
        />
      </LanguageContext.Provider>
    );
  }

  if (!currentUser) {
    return (
      <LanguageContext.Provider value={language}>
        <AnimatedLoading />
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={language}>
      <AppShell
        activeView={activeView}
        currentUser={currentUser}
        language={language}
        onLanguageChange={changeLanguage}
        onNavigate={setActiveView}
        onLogout={async () => {
          await revokeCurrentPushSubscription().catch(() => undefined);
          await api.logout().catch(() => undefined);
          setAuthenticated(false);
          setCurrentUser(null);
          setActiveView('command');
        }}
      />
    </LanguageContext.Provider>
  );
}

function PolibeliLogo({ size = 52, className = '' }: { size?: number; className?: string }) {
  return (
    <Box
      className={`polibeli-logo ${className}`}
      sx={{ width: size, height: size }}
      role="img"
      aria-label="Polibeli"
    >
      <img src={logoUrl} alt="Polibeli" />
    </Box>
  );
}

function AnimatedLoading() {
  return (
    <Box className="loading-page">
      <Box className="loading-card">
        <PolibeliLogo size={72} className="loading-logo" />
        <svg className="loader-illustration" viewBox="0 0 260 220" role="img" aria-label="Loading">
          <defs>
            <linearGradient id="loaderPanel" x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#17312e" />
              <stop offset="1" stopColor="#0d1817" />
            </linearGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="loader-route"
            d="M45 160 C72 118, 92 170, 126 128 S190 78, 218 116"
            fill="none"
            stroke="#2fd0a8"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect x="63" y="45" width="134" height="112" rx="18" fill="url(#loaderPanel)" />
          <rect x="79" y="65" width="102" height="15" rx="7" fill="#263f3b" />
          <rect x="79" y="91" width="76" height="10" rx="5" fill="#324d48" />
          <rect x="79" y="111" width="92" height="10" rx="5" fill="#324d48" />
          <g className="loader-fan" transform="translate(171 120)" filter="url(#softGlow)">
            <circle r="28" fill="#102724" stroke="#2fd0a8" strokeWidth="5" />
            <path d="M0 -7 C17 -33, 35 -23, 18 -4 Z" fill="#61c8ff" />
            <path d="M6 3 C35 9, 34 30, 8 17 Z" fill="#f5c84c" />
            <path d="M-6 3 C-25 26, -42 13, -15 -6 Z" fill="#2fd0a8" />
            <circle r="6" fill="#f3fbf8" />
          </g>
          <g className="loader-pin" transform="translate(48 153)">
            <path
              d="M0 -31 C-15 -31 -27 -19 -27 -4 C-27 17 0 39 0 39 C0 39 27 17 27 -4 C27 -19 15 -31 0 -31Z"
              fill="#ff8b73"
            />
            <circle r="10" fill="#07100f" />
          </g>
          <g className="loader-pulse" transform="translate(218 116)">
            <circle r="13" fill="#f5c84c" />
            <circle r="5" fill="#07100f" />
          </g>
        </svg>
        <Typography variant="h5">Polibeli Field Force</Typography>
        <Typography color="text.secondary">Menyiapkan KLWT cooling blitz...</Typography>
        <LinearProgress className="loading-progress" />
      </Box>
    </Box>
  );
}

type LoginPageProps = {
  error: string;
  pending: boolean;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  onEnter: (username: string, password: string) => void;
};

function LanguageButton({
  language,
  onLanguageChange,
  className = '',
  compact = false,
}: {
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  className?: string;
  compact?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedLanguage = languageOptions.find((option) => option.key === language) ?? languageOptions[0];

  return (
    <Box className={className} data-no-i18n>
      <Button
        variant="outlined"
        size="small"
        startIcon={<LanguageRoundedIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="language-switch-button"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
      >
        {compact ? selectedLanguage.shortLabel : `${selectedLanguage.shortLabel} · ${selectedLanguage.nativeLabel}`}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {languageOptions.map((option) => (
          <MenuItem
            key={option.key}
            selected={option.key === language}
            onClick={() => {
              onLanguageChange(option.key);
              setAnchorEl(null);
            }}
          >
            <Stack spacing={0.25}>
              <Typography fontWeight={900}>{option.nativeLabel}</Typography>
              <Typography variant="caption" color="text.secondary">
                {option.label}
              </Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

function LoginPage({ error, pending, language, onLanguageChange, onEnter }: LoginPageProps) {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordPeekActive = passwordFocused || Boolean(password);
  const t = (text: string) => translateInline(text, language);

  return (
    <Box className="login-page">
      <LanguageButton language={language} onLanguageChange={onLanguageChange} className="login-language-switch" />
      <Box className="login-form-area">
        <Stack spacing={4} className="login-form">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PolibeliLogo size={52} />
            <Box>
              <Typography variant="h5">{t('Polibeli Ops')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('KLWT Cooling Parts Campaign')}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h3" className="login-title">
              {t('Field Force Survey Management')}
            </Typography>
            <Typography color="text.secondary">
              {t('Masuk sebagai tim operasional Polibeli untuk assignment, survey, verifikasi, scoring, dan export KLWT.')}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label={t('Username / nomor HP')}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box className="password-field-wrap">
              <PasswordPeekLogo active={passwordPeekActive} revealing={showPassword} />
              <TextField
                label={t('Password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !pending) onEnter(username, password);
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={showPassword ? t('Sembunyikan password') : t('Intip password')}>
                        <IconButton
                          aria-label={showPassword ? t('Sembunyikan password') : t('Intip password')}
                          edge="end"
                          onClick={() => setShowPassword((current) => !current)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {error && (
              <Chip
                color="error"
                icon={<WarningAmberRoundedIcon />}
                label={error}
                sx={{ justifyContent: 'flex-start', minHeight: 40 }}
              />
            )}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              startIcon={<DashboardRoundedIcon />}
              onClick={() => onEnter(username, password)}
              disabled={pending}
              fullWidth
            >
              {pending ? t('Memeriksa akun...') : t('Masuk Dashboard')}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box className="login-preview">
        <Paper className="preview-panel" sx={{ background: alpha(theme.palette.background.paper, 0.86) }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', color: 'background.default' }}>
                <CampaignRoundedIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{t('National Progress')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('21 hari kampanye, 16 Surveyor, 5,000 toko')}
                </Typography>
              </Box>
            </Stack>
            <Chip label={t('PRD v2 ready')} color="primary" variant="outlined" />
          </Stack>
          <Box className="preview-grid">
            {campaignPreviewCards.map((metric) => (
              <Box key={metric.label} className="preview-metric">
                <Typography variant="h4">{metric.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(metric.label)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider />
          <Stack spacing={1.5}>
            {todayPlan.map((item) => (
              <Stack key={item.name} direction="row" spacing={1.5} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.16) }}>
                  <StorefrontRoundedIcon color="primary" />
                </Avatar>
                <Box flex={1}>
                  <Typography fontWeight={800} data-no-i18n>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.area} - {item.tag}
                  </Typography>
                </Box>
                <Chip label={item.status} size="small" />
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function PasswordPeekLogo({ active, revealing }: { active: boolean; revealing: boolean }) {
  return (
    <Box className={`password-peek-logo ${active ? 'is-active' : ''} ${revealing ? 'is-revealing' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 128 86" role="img">
        <ellipse className="peek-shadow" cx="64" cy="75" rx="42" ry="7" />
        <g className="peek-mascot">
          <path
            className="peek-tail"
            d="M89 43 C103 36 114 40 120 51 C107 57 98 58 88 53 Z"
            fill="#ff8a1f"
          />
          <path
            className="peek-body"
            d="M27 69 C22 51 29 29 46 20 C62 11 84 15 95 31 C107 49 97 72 76 76 C55 80 34 78 27 69Z"
            fill="#ff6a00"
          />
          <path className="peek-belly" d="M40 68 C50 58 69 57 81 69 C69 75 51 76 40 68Z" fill="#f45100" opacity="0.6" />
          <circle className="peek-eye-white" cx="67" cy="39" r="18" fill="#fff8ef" />
          <circle className="peek-pupil" cx="67" cy="39" r="7" fill="#273d39" />
          <path className="peek-beak" d="M92 43 L115 51 L92 58 Z" fill="#ff7b18" />
          <path
            className="peek-wing"
            d="M45 54 C31 63 25 61 24 51 C34 42 45 41 56 47 Z"
            fill="#ff8a1f"
          />
          <path className="peek-hand peek-hand-left" d="M42 56 C50 47 58 45 64 50 C58 61 50 66 39 66 Z" fill="#ff9a2d" />
          <path className="peek-hand peek-hand-right" d="M74 51 C84 47 91 50 95 59 C88 67 78 65 70 58 Z" fill="#ff9a2d" />
        </g>
        <rect className="peek-wall" x="10" y="62" width="108" height="18" rx="9" />
      </svg>
    </Box>
  );
}

type AppShellProps = {
  activeView: ViewKey;
  currentUser: AppUser;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  onNavigate: (view: ViewKey) => void;
  onLogout: () => void;
};

type PushDeviceState = {
  supported: boolean;
  serverEnabled: boolean;
  publicKey: string;
  source: PushNotificationStatus['source'] | '';
  reason: string;
  permission: NotificationPermission | 'unsupported';
  subscribed: boolean;
  activeSubscriptions: number;
  loading: boolean;
  busy: boolean;
  error: string;
};

const initialPushDeviceState: PushDeviceState = {
  supported: false,
  serverEnabled: false,
  publicKey: '',
  source: '',
  reason: '',
  permission: 'unsupported',
  subscribed: false,
  activeSubscriptions: 0,
  loading: true,
  busy: false,
  error: '',
};

function AppShell({ activeView, currentUser, language, onLanguageChange, onNavigate, onLogout }: AppShellProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isTabletLandscape = useMediaQuery('(min-width:900px) and (max-width:1180px) and (orientation: landscape)');
  const isMobile = isSmallScreen || isTabletLandscape;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shellDialog, setShellDialog] = useState<'filter' | 'notifications' | null>(null);
  const [shellFilterForm, setShellFilterForm] = useState({ scopeArea: '', leadPriority: '' });
  const [notice, setNotice] = useState<Notice | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationError, setNotificationError] = useState('');
  const [pushDeviceState, setPushDeviceState] = useState<PushDeviceState>(initialPushDeviceState);
  const role = currentUser.role;
  const visibleNavItems = getVisibleNavItems(role);
  const effectiveView = canAccessView(role, activeView) ? activeView : defaultViewForRole(role);

  const title = translateInline(navItems.find((item) => item.key === effectiveView)?.label ?? 'Executive Dashboard', language);
  const notificationDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language === 'zh' ? 'zh-CN' : 'id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [language],
  );

  useEffect(() => {
    let active = true;

    const loadPushDeviceState = async () => {
      const supported = browserPushSupported();
      if (!supported) {
        setPushDeviceState({
          ...initialPushDeviceState,
          supported: false,
          loading: false,
          reason: 'Browser tidak mendukung Web Push.',
        });
        return;
      }

      try {
        setPushDeviceState((current) => ({ ...current, supported: true, loading: true, error: '' }));
        const registration = await navigator.serviceWorker.getRegistration('/');
        const subscription = await registration?.pushManager.getSubscription();
        const serverStatus = await api.pushNotificationStatus(subscription?.endpoint);
        if (!active) return;

        setPushDeviceState({
          supported: true,
          serverEnabled: serverStatus.enabled,
          publicKey: serverStatus.publicKey,
          source: serverStatus.source,
          reason: serverStatus.reason,
          permission: Notification.permission,
          subscribed: serverStatus.currentDeviceSubscribed,
          activeSubscriptions: serverStatus.activeSubscriptions,
          loading: false,
          busy: false,
          error: '',
        });
      } catch (error) {
        if (!active) return;
        setPushDeviceState((current) => ({
          ...current,
          supported,
          permission: Notification.permission,
          loading: false,
          error: error instanceof Error ? error.message : 'Status push perangkat gagal dimuat.',
        }));
      }
    };

    loadPushDeviceState();
    return () => {
      active = false;
    };
  }, [currentUser.id]);

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        setNotificationError('');
        const result = await api.notifications({ limit: 50 });
        if (!active) return;
        setNotifications(result.notifications);
        setUnreadNotificationCount(result.unreadCount);
      } catch (error) {
        if (active) setNotificationError(error instanceof Error ? error.message : 'Notifikasi gagal dimuat.');
      } finally {
        if (active) setNotificationLoading(false);
      }
    };

    setNotificationLoading(true);
    loadNotifications();
    const interval = globalThis.setInterval(loadNotifications, 45_000);
    return () => {
      active = false;
      globalThis.clearInterval(interval);
    };
  }, [currentUser.id]);

  const enablePushNotifications = async () => {
    if (!browserPushSupported()) {
      setNotice({ message: 'Browser perangkat ini belum mendukung Web Push.', severity: 'warning' });
      return;
    }

    setPushDeviceState((current) => ({ ...current, busy: true, error: '' }));
    try {
      const serverStatus =
        pushDeviceState.serverEnabled && pushDeviceState.publicKey
          ? {
              enabled: pushDeviceState.serverEnabled,
              publicKey: pushDeviceState.publicKey,
              reason: pushDeviceState.reason,
            }
          : await api.pushNotificationStatus();
      if (!serverStatus.enabled) throw new Error(serverStatus.reason || 'Web Push backend belum aktif.');
      const publicKey = serverStatus.publicKey;
      if (!publicKey) throw new Error('Public key Web Push belum tersedia.');

      const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushDeviceState((current) => ({ ...current, permission, busy: false }));
        setNotice({ message: 'Izin notifikasi perangkat belum diberikan.', severity: 'warning' });
        return;
      }

      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await api.registerPushSubscription(pushSubscriptionToPayload(subscription));
      const latestStatus = await api.pushNotificationStatus(subscription.endpoint);
      setPushDeviceState((current) => ({
        ...current,
        supported: true,
        serverEnabled: latestStatus.enabled,
        publicKey: latestStatus.publicKey,
        source: latestStatus.source,
        reason: latestStatus.reason,
        permission,
        subscribed: latestStatus.currentDeviceSubscribed,
        activeSubscriptions: latestStatus.activeSubscriptions,
        loading: false,
        busy: false,
        error: '',
      }));
      setNotice({ message: 'Push notification aktif di perangkat ini.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Push notification gagal diaktifkan.';
      setPushDeviceState((current) => ({ ...current, busy: false, error: message }));
      setNotice({ message, severity: 'error' });
    }
  };

  const disablePushNotifications = async () => {
    if (!browserPushSupported()) return;

    setPushDeviceState((current) => ({ ...current, busy: true, error: '' }));
    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await api.revokePushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }

      const latestStatus = await api.pushNotificationStatus();
      setPushDeviceState((current) => ({
        ...current,
        serverEnabled: latestStatus.enabled,
        publicKey: latestStatus.publicKey,
        source: latestStatus.source,
        reason: latestStatus.reason,
        permission: Notification.permission,
        subscribed: false,
        activeSubscriptions: latestStatus.activeSubscriptions,
        loading: false,
        busy: false,
        error: '',
      }));
      setNotice({ message: 'Push notification perangkat dinonaktifkan.', severity: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Push notification gagal dinonaktifkan.';
      setPushDeviceState((current) => ({ ...current, busy: false, error: message }));
      setNotice({ message, severity: 'error' });
    }
  };

  const openNotification = async (notification: NotificationItem) => {
    if (!notification.readAt) {
      try {
        const result = await api.markNotificationRead(notification.id);
        setNotifications((current) => current.map((item) => (item.id === notification.id ? result.notification : item)));
        setUnreadNotificationCount((current) => Math.max(0, current - 1));
      } catch (error) {
        setNotice({ message: error instanceof Error ? error.message : 'Notifikasi gagal ditandai dibaca.', severity: 'error' });
        return;
      }
    }

    const nextView = viewKeyFromNotification(notification.actionView);
    if (nextView && canAccessView(role, nextView)) onNavigate(nextView);
    setShellDialog(null);
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      const readAt = new Date().toISOString();
      setNotifications((current) => current.map((item) => (item.readAt ? item : { ...item, readAt })));
      setUnreadNotificationCount(0);
      setNotice({ message: 'Semua notifikasi ditandai sudah dibaca.', severity: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Notifikasi gagal ditandai dibaca.', severity: 'error' });
    }
  };

  const pushDeviceLabel = pushDeviceState.loading
    ? 'Memuat'
    : !pushDeviceState.supported
      ? 'Tidak didukung'
      : pushDeviceState.subscribed
        ? 'Aktif'
        : pushDeviceState.permission === 'denied'
          ? 'Diblokir'
          : !pushDeviceState.serverEnabled
            ? 'Backend nonaktif'
            : 'Nonaktif';
  const pushDeviceColor: ComponentProps<typeof MuiChip>['color'] = pushDeviceState.subscribed
    ? 'success'
    : pushDeviceState.permission === 'denied' || (!pushDeviceState.serverEnabled && pushDeviceState.supported)
      ? 'warning'
      : 'default';
  const pushDeviceCaption = pushDeviceState.subscribed
    ? 'Aktif di perangkat ini'
    : pushDeviceState.permission === 'denied'
      ? 'Izin perangkat diblokir'
      : pushDeviceState.reason || 'Nonaktif di perangkat ini';
  const pushToggleDisabled =
    pushDeviceState.loading ||
    pushDeviceState.busy ||
    !pushDeviceState.supported ||
    pushDeviceState.permission === 'denied' ||
    (!pushDeviceState.serverEnabled && !pushDeviceState.subscribed);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [effectiveView]);

  useEffect(() => {
    if (effectiveView !== activeView) onNavigate(effectiveView);
  }, [activeView, effectiveView, onNavigate]);

  const drawer = (
    <Box className="app-drawer">
      <Stack direction="row" spacing={1.5} alignItems="center" className="drawer-brand">
        <PolibeliLogo size={46} />
        <Box>
          <Typography variant="h6">Polibeli</Typography>
          <Typography variant="caption" color="text.secondary">
            KLWT field force
          </Typography>
        </Box>
      </Stack>
      <List className="drawer-nav">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const selected = (effectiveView === 'survey-detail' ? 'surveyor' : effectiveView) === item.key;
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => {
                onNavigate(item.key);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={translateInline(item.label, language)} />
            </ListItemButton>
          );
        })}
      </List>
      <Box className="drawer-footer">
        <Stack direction="row" spacing={1} alignItems="center">
          <CloudDoneRoundedIcon color="primary" />
          <Box>
            <Typography variant="body2" fontWeight={800}>
              Offline-lite ready
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Draft local, sync pending, retry submit
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box className="app-layout">
      <AppBar position="fixed" className="topbar">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Box flex={1} className="topbar-title">
            <Typography variant="h6">{title}</Typography>
            <Typography variant="caption" color="text.secondary">
              KLWT Cooling Merchant Penetration Intelligence Platform
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" className="topbar-actions">
            <LanguageButton language={language} onLanguageChange={onLanguageChange} compact className="topbar-language-switch" />
            <Tooltip title={localCopy(language, { id: 'Atur filter data yang dipakai halaman ini.', en: 'Adjust the data filters used on this page.', zh: '调整本页面使用的数据筛选条件。' })}>
              <IconButton aria-label="Filter data" onClick={() => setShellDialog('filter')}>
                <FilterAltRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={localCopy(language, { id: 'Lihat notifikasi sistem dan antrean penting.', en: 'View system notifications and important queues.', zh: '查看系统通知和重要队列。' })}>
              <IconButton aria-label="Notifications" onClick={() => setShellDialog('notifications')}>
                <Badge color="warning" badgeContent={unreadNotificationCount} max={99} invisible={unreadNotificationCount === 0}>
                  <NotificationsRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Stack direction="row" spacing={1} alignItems="center" className="user-pill">
              <Avatar sx={{ width: 34, height: 34 }}>{currentUser.name.slice(0, 1)}</Avatar>
              <Box className="user-pill-copy">
                <Typography variant="body2" fontWeight={900}>
                  {currentUser.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser.role}
                </Typography>
              </Box>
            </Stack>
            <Tooltip title={localCopy(language, { id: 'Keluar dari akun ini.', en: 'Sign out of this account.', zh: '退出当前账号。' })}>
              <IconButton aria-label="Logout" onClick={onLogout}>
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        {!isMobile && (
          <Box className="desktop-drawer" sx={{ width: drawerWidth }}>
            {drawer}
          </Box>
        )}
        {isMobile && (
          <Box className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
            <Box className="mobile-backdrop" onClick={() => setMobileOpen(false)} />
            <Paper className="mobile-drawer-panel">{drawer}</Paper>
          </Box>
        )}
      </Box>

      <Box component="main" className={`main-content view-${effectiveView}`}>
        <RoleContextBar role={role} />
        <Suspense fallback={<LinearProgress />}>
          {effectiveView === 'command' && <CommandCenter />}
          {effectiveView === 'assignments' && <AssignmentsPage />}
          {(effectiveView === 'surveyor' || effectiveView === 'survey-detail') && (
            <SurveyorPwaPage
              view={effectiveView === 'survey-detail' ? 'detail' : 'list'}
              onOpenSurvey={() => onNavigate('survey-detail')}
              onBackToList={() => onNavigate('surveyor')}
            />
          )}
          {effectiveView === 'verification' && <VerificationPage />}
          {effectiveView === 'intelligence' && <IntelligencePage />}
          {effectiveView === 'admin' && <AdminPage role={role} />}
          {effectiveView === 'users' && role === 'Administrator' && <UsersPage />}
        </Suspense>
      </Box>

      <Dialog open={shellDialog === 'filter'} onClose={() => setShellDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>Filter Data Campaign</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              select
              label="Scope area"
              value={shellFilterForm.scopeArea}
              onChange={(event) => setShellFilterForm((current) => ({ ...current, scopeArea: event.target.value }))}
            >
              <MenuItem value="">
                <em>Pilih scope area</em>
              </MenuItem>
              <MenuItem value="All Java">All Java</MenuItem>
              <MenuItem value="Jabodetabek">Jabodetabek</MenuItem>
              <MenuItem value="Jawa Tengah - Timur">Jawa Tengah - Timur</MenuItem>
            </TextField>
            <TextField
              select
              label="Lead priority"
              value={shellFilterForm.leadPriority}
              onChange={(event) => setShellFilterForm((current) => ({ ...current, leadPriority: event.target.value }))}
            >
              <MenuItem value="">
                <em>Pilih lead priority</em>
              </MenuItem>
              <MenuItem value="All leads">All leads</MenuItem>
              <MenuItem value="Hot Lead">Hot Lead</MenuItem>
              <MenuItem value="Warning">Warning data</MenuItem>
            </TextField>
            <DialogContentText>
              Filter ini menyiapkan konteks dashboard aktif. Integrasi query database per halaman akan memakai scope yang sama pada tahap berikutnya.
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShellDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShellDialog(null);
              setNotice({ message: 'Filter campaign diterapkan untuk sesi tampilan ini.', severity: 'success' });
            }}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={shellDialog === 'notifications'} onClose={() => setShellDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Box>{translateInline('Notifications', language)}</Box>
            <MuiChip size="small" color={unreadNotificationCount ? 'warning' : 'default'} label={`${unreadNotificationCount} unread`} />
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} pt={1}>
            <Paper className="push-device-card">
              <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1.5}>
                <Stack direction="row" alignItems="center" gap={1.2} minWidth={0}>
                  <NotificationsActiveRoundedIcon color={pushDeviceState.subscribed ? 'success' : 'disabled'} />
                  <Box minWidth={0}>
                    <Typography fontWeight={900}>Push perangkat</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pushDeviceCaption}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <MuiChip size="small" color={pushDeviceColor} label={pushDeviceLabel} />
                  <Switch
                    checked={pushDeviceState.subscribed}
                    onChange={(event) => {
                      if (event.target.checked) {
                        enablePushNotifications();
                      } else {
                        disablePushNotifications();
                      }
                    }}
                    disabled={pushToggleDisabled}
                    inputProps={{ 'aria-label': 'Push notification perangkat' }}
                  />
                </Stack>
              </Stack>
              {pushDeviceState.error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {pushDeviceState.error}
                </Alert>
              )}
            </Paper>
            {notificationLoading && <LinearProgress />}
            {notificationError && <Alert severity="error">{notificationError}</Alert>}
            {!notificationLoading && !notificationError && notifications.length === 0 && (
              <Box className="empty-state-inline">
                <CheckCircleRoundedIcon />
                <Typography variant="body2" color="text.secondary">
                  Tidak ada notifikasi untuk akun ini.
                </Typography>
              </Box>
            )}
            {notifications.map((notification) => (
              <Paper
                key={notification.id}
                className={`signal-item notification-item ${notification.readAt ? 'read' : 'unread'}`}
                role="button"
                tabIndex={0}
                onClick={() => openNotification(notification)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openNotification(notification);
                  }
                }}
              >
                <Stack spacing={0.8}>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
                    <Box minWidth={0}>
                      <Typography fontWeight={900}>{notification.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.body}
                      </Typography>
                    </Box>
                    <MuiChip size="small" color={notificationChipColor(notification.severity)} label={notification.readAt ? 'Read' : 'Unread'} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {notificationDateFormatter.format(new Date(notification.createdAt))}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={markAllNotificationsRead}
            disabled={unreadNotificationCount === 0}
          >
            Mark All Read
          </Button>
        </DialogActions>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}

function RoleContextBar({ role }: { role: Role }) {
  const roleCopy: Record<Role, string> = {
    Head: 'Executive performance, market intelligence, and final export governance.',
    Manager: 'Visit routing, target store pool, and assignment readiness.',
    Surveyor: 'Assigned visits, manual additions, drafts, submitted reports, and submission results.',
    Verificator: 'Verification queue, evidence review, GPS validation, and duplicate decisions.',
    Administrator: 'Master data, territory, survey options, scoring, and export controls.',
  };

  return (
    <Paper className="context-bar">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
        <Stack direction="row" spacing={1.2} alignItems="center" flex={1}>
          <BadgeRoundedIcon color="primary" />
          <Box>
            <Typography variant="body2" fontWeight={900}>
              Active role: {role}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {roleCopy[role]}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip icon={<CloudSyncRoundedIcon />} label="Sync healthy" color="primary" variant="outlined" />
          <Chip icon={<CalendarMonthRoundedIcon />} label={`Campaign day ${campaignElapsedDays}/${campaignTotalDays}`} />
          <Chip icon={<DirectionsCarFilledRoundedIcon />} label="Cooling parts" color="secondary" variant="outlined" />
        </Stack>
      </Stack>
    </Paper>
  );
}

function detailText(value?: string | number | null) {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
}

function detailList(values?: string[]) {
  return values?.length ? values.join(', ') : '-';
}

function splitPhotoMissingReasons(reason?: string) {
  return String(reason ?? '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function photoMissingText(row: SurveyHistoryItem, type: 'front' | 'rack' | 'pic') {
  if (type === 'front') return 'Foto tampak depan wajib, tetapi belum tersedia pada record ini.';
  const reasons = splitPhotoMissingReasons(row.photoMissingReason);
  if (type === 'rack') return reasons[0] || row.photoMissingReason || 'Foto dalam/rak belum tersedia dan alasan belum tercatat.';
  if (!row.interiorPhotoUrl && reasons[1]) return reasons[1];
  return reasons[0] || row.photoMissingReason || 'Foto dengan PIC belum tersedia dan alasan belum tercatat.';
}

function SurveyPhotoEvidenceGrid({ survey }: { survey: SurveyHistoryItem }) {
  const language = useCurrentLanguage();
  const [previewPhoto, setPreviewPhoto] = useState<{ label: string; url: string } | null>(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const photos = [
    { key: 'front', label: 'Front', url: survey.storefrontPhotoUrl, reason: photoMissingText(survey, 'front') },
    { key: 'rack', label: 'Rack / Interior', url: survey.interiorPhotoUrl, reason: photoMissingText(survey, 'rack') },
    { key: 'pic', label: 'PIC', url: survey.picPhotoUrl, reason: photoMissingText(survey, 'pic') },
  ];
  const closePreview = () => {
    setPreviewPhoto(null);
    setPreviewZoom(1);
  };
  const adjustPreviewZoom = (nextZoom: number) => setPreviewZoom(Math.max(1, Math.min(4, Number(nextZoom.toFixed(2)))));

  return (
    <>
      <Box className="review-photo-grid">
        {photos.map((photo) => (
          <Paper
            key={photo.key}
            component={photo.url ? 'button' : 'div'}
            type={photo.url ? 'button' : undefined}
            className={photo.url ? 'review-photo ok clickable' : 'review-photo warn'}
            onClick={photo.url ? () => setPreviewPhoto({ label: photo.label, url: photo.url }) : undefined}
          >
            {photo.url ? (
              <>
                <Box component="img" src={photo.url} alt={`${photo.label} evidence`} className="review-photo-image" />
                <Box className="review-photo-copy">
                  <Typography fontWeight={900}>{photo.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Klik untuk lihat ukuran penuh
                  </Typography>
                </Box>
              </>
            ) : (
              <Stack spacing={0.7} alignItems="center" className="review-photo-copy">
                <PhotoCameraRoundedIcon />
                <Typography fontWeight={900}>{photo.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {photo.reason}
                </Typography>
              </Stack>
            )}
          </Paper>
        ))}
      </Box>
      <Dialog open={Boolean(previewPhoto)} onClose={closePreview} fullScreen maxWidth="xl" className="photo-lightbox-dialog">
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Box minWidth={0}>
              <Typography fontWeight={900}>{previewPhoto?.label ?? 'Photo Evidence'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Zoom {Math.round(previewZoom * 100)}%
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title={localCopy(language, { id: 'Perkecil tampilan foto.', en: 'Zoom the photo out.', zh: '缩小照片。' })}>
                <span>
                  <IconButton aria-label="Zoom out photo" onClick={() => adjustPreviewZoom(previewZoom - 0.25)} disabled={previewZoom <= 1}>
                    <ZoomOutRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={localCopy(language, { id: 'Kembalikan foto ke ukuran normal.', en: 'Reset the photo to normal size.', zh: '将照片恢复到正常大小。' })}>
                <IconButton aria-label="Reset photo zoom" onClick={() => adjustPreviewZoom(1)}>
                  <RestartAltRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={localCopy(language, { id: 'Perbesar foto untuk melihat detail.', en: 'Zoom the photo in to inspect details.', zh: '放大照片以查看细节。' })}>
                <span>
                  <IconButton aria-label="Zoom in photo" onClick={() => adjustPreviewZoom(previewZoom + 0.25)} disabled={previewZoom >= 4}>
                    <ZoomInRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton aria-label="Close photo preview" onClick={closePreview}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent
          className="photo-lightbox-content"
          onWheel={(event) => {
            if (!event.ctrlKey && Math.abs(event.deltaY) < 18) return;
            event.preventDefault();
            adjustPreviewZoom(previewZoom + (event.deltaY < 0 ? 0.15 : -0.15));
          }}
        >
          {previewPhoto && (
            <Box className="photo-lightbox-stage">
              <Box
                component="img"
                src={previewPhoto.url}
                alt={`${previewPhoto.label} full size`}
                className="photo-lightbox-image"
                sx={{ transform: `scale(${previewZoom})` }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function SurveyDetailField({ label, value, noI18n = false }: { label: string; value: string | number; noI18n?: boolean }) {
  return (
    <Box className="survey-detail-field">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={800} data-no-i18n={noI18n || undefined}>
        {value}
      </Typography>
    </Box>
  );
}

function SubmittedSurveyDetailPage({
  survey,
  onBack,
  mode = 'page',
}: {
  survey: SurveyHistoryItem;
  onBack: () => void;
  mode?: 'page' | 'dialog';
}) {
  const language = useCurrentLanguage();
  const mapsHref = googleMapsUrl(survey.latitude, survey.longitude);
  const waHref = whatsappUrl(survey.whatsappNumber, survey.storeName, survey.contactPersonName);
  const callHref = phoneCallUrl(survey.whatsappNumber);
  const isDialog = mode === 'dialog';

  return (
    <Stack spacing={isDialog ? 2 : 3} className={isDialog ? 'survey-detail-dialog-body' : undefined}>
      <Paper className="section-panel survey-result-detail-header">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <Stack spacing={0.8} minWidth={0}>
            <Typography variant="caption" color="text.secondary">
              Detail Survey
            </Typography>
            <Typography variant={isDialog ? 'h5' : 'h4'} data-no-i18n>
              {survey.storeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dijalankan oleh <span data-no-i18n>{survey.surveyorName}</span> - {formatSubmittedAt(survey.submitTime)}
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={isDialog ? <CloseRoundedIcon /> : <KeyboardArrowRightRoundedIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={onBack}
            >
              {isDialog ? 'Tutup Detail' : 'Kembali ke Progress Surveyor'}
            </Button>
            {mapsHref && (
              <Button variant="outlined" startIcon={<MapRoundedIcon />} href={mapsHref} target="_blank" rel="noreferrer">
                Buka Google Maps
              </Button>
            )}
            {waHref && (
              <Button variant="contained" startIcon={<WhatsAppIcon />} href={waHref} target="_blank" rel="noreferrer">
                Kirim WhatsApp
              </Button>
            )}
            {callHref && (
              <Button variant="outlined" startIcon={<PhoneRoundedIcon />} href={callHref}>
                Telepon Customer
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Box className="score-grid">
        <ScoreBadge label="Merchant Potential" value={survey.merchantGrade} caption={`${survey.merchantPotentialScore}/100`} tone="#f5c84c" />
        <ScoreBadge label="Data Quality" value={survey.dataQualityGrade} caption={`${survey.dataQualityScore}/100`} tone="#2fd0a8" />
        <ScoreBadge label="Lead Type" value={survey.leadClassification} caption={verificationStatusLabel(survey.verificationStatus, language)} tone="#61c8ff" />
      </Box>

      <Box className="survey-result-detail-grid">
        <Paper className="section-panel">
          <SectionTitle icon={<FactCheckRoundedIcon />} title="Ringkasan Survey" />
          <Box className="survey-detail-field-grid">
            <SurveyDetailField label="Store code" value={survey.storeCode} noI18n />
            <SurveyDetailField label="Store alias" value={detailText(survey.storeAlias)} noI18n />
            <SurveyDetailField label="Visit Outcome" value={survey.visitOutcome} />
            <SurveyDetailField label="Status verifikasi" value={verificationStatusLabel(survey.verificationStatus, language)} />
            <SurveyDetailField label="Planned / Unplanned" value={survey.plannedOrUnplanned} />
            <SurveyDetailField label="Manager" value={survey.managerName} noI18n />
          </Box>
          {survey.revisionRequest && (
            <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
              {survey.revisionRequest}
            </Alert>
          )}
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<PinDropRoundedIcon />} title="Detail Lokasi" />
          <Box className="survey-detail-field-grid">
            <SurveyDetailField label="Province" value={survey.province} />
            <SurveyDetailField label="City" value={survey.city} />
            <SurveyDetailField label="Kecamatan" value={survey.district} />
            <SurveyDetailField label="Desa/Kelurahan" value={survey.village} />
            <SurveyDetailField label="Detailed Address" value={detailText(survey.addressDetail)} />
            <SurveyDetailField label="Landmark / patokan" value={detailText(survey.landmark)} />
            <SurveyDetailField label="Latitude" value={detailText(survey.latitude)} noI18n />
            <SurveyDetailField label="Longitude" value={detailText(survey.longitude)} noI18n />
            <SurveyDetailField label="Accuracy" value={`${survey.gpsAccuracy}m`} />
            <SurveyDetailField label="Distance" value={`${survey.gpsDistanceFromTarget}m`} />
          </Box>
          <Box className="survey-detail-map-preview">
            <GpsMapPreview
              surveyLatitude={survey.latitude}
              surveyLongitude={survey.longitude}
              accuracy={survey.gpsAccuracy}
              distance={survey.gpsDistanceFromTarget}
              language={language}
              copyOverrides={{
                title: localCopy(language, {
                  id: 'Preview lokasi submit',
                  en: 'Submitted location preview',
                  zh: '提交位置预览',
                }),
                surveyor: localCopy(language, {
                  id: 'Titik submit',
                  en: 'Submitted point',
                  zh: '提交点',
                }),
                target: localCopy(language, {
                  id: 'Target toko',
                  en: 'Store target',
                  zh: '门店目标点',
                }),
                waiting: localCopy(language, {
                  id: 'Koordinat survey belum tersedia.',
                  en: 'Survey coordinates are not available yet.',
                  zh: '暂无调研坐标。',
                }),
                noTarget: localCopy(language, {
                  id: 'Koordinat survey belum tersedia untuk ditampilkan.',
                  en: 'Survey coordinates are not available to display yet.',
                  zh: '暂无可显示的调研坐标。',
                }),
                surveyOnly: localCopy(language, {
                  id: 'Titik submit tersimpan di detail survey.',
                  en: 'Submitted point is stored in the survey detail.',
                  zh: '提交点已保存在调研详情中。',
                }),
              }}
            />
          </Box>
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<PersonRoundedIcon />} title="Kontak & Bisnis" />
          <Box className="survey-detail-field-grid">
            <SurveyDetailField label="PIC / narasumber" value={detailText(survey.contactPersonName)} noI18n />
            <SurveyDetailField label="PIC Type" value={survey.picType} />
            <SurveyDetailField label="WhatsApp number" value={detailText(survey.whatsappNumber || survey.waEmptyReason)} noI18n />
            <SurveyDetailField label="Bisa ditelepon" value={contactAssessmentLabel(survey.verifierPhoneCallable, 'Ya, sudah dicek', 'Tidak bisa ditelepon')} />
            <SurveyDetailField label="Bisa dihubungi WhatsApp" value={contactAssessmentLabel(survey.verifierWhatsappReachable, 'Ya, sudah dicek', 'Tidak reachable')} />
            <SurveyDetailField label="Kontak dicek" value={survey.verifierContactCheckedAt ? formatSubmittedAt(survey.verifierContactCheckedAt) : 'Belum dicek'} />
            <SurveyDetailField label="Purchasing Decision Maker" value={survey.purchasingDecisionMaker} />
            <SurveyDetailField label="Decision Maker Availability" value={survey.decisionMakerAvailability} />
            <SurveyDetailField label="Main Business Type" value={survey.businessType} />
            <SurveyDetailField label="Vehicle Specialization" value={detailList(survey.vehicleSpecialization)} />
            <SurveyDetailField label="Store Scale Estimate" value={survey.storeScale} />
          </Box>
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<LocalShippingRoundedIcon />} title="Cooling vs Supplier" />
          <Box className="survey-detail-field-grid">
            <SurveyDetailField label="Cooling Products Seen / Sold" value={detailList(survey.coolingProducts)} />
            <SurveyDetailField label="Cooling Shelf / Stock Size" value={survey.coolingShelfSize} />
            <SurveyDetailField label="Cooling Sales Activity" value={survey.coolingSalesActivity} />
            <SurveyDetailField label="Cooling Brands Seen / Sold" value={detailList(survey.coolingBrands)} />
            <SurveyDetailField label="Product Selling Segment" value={survey.productSellingSegment} />
            <SurveyDetailField label="Low Cost Import Share" value={survey.lowCostImportShare} />
            <SurveyDetailField label="Supplier Type" value={detailList(survey.supplierType)} />
            <SurveyDetailField label="Existing supplier name" value={detailText(survey.supplierName)} noI18n />
            <SurveyDetailField label="Supplier Dependency" value={survey.supplierDependency} />
            <SurveyDetailField label="Supplier Satisfaction" value={survey.supplierSatisfaction} />
          </Box>
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<AnalyticsRoundedIcon />} title="Komersial & Follow-up" />
          <Box className="survey-detail-field-grid">
            <SurveyDetailField label="Return Ease" value={survey.returnEase} />
            <SurveyDetailField label="Delivery Speed" value={survey.deliverySpeed} />
            <SurveyDetailField label="Restock Frequency" value={survey.restockFrequency} />
            <SurveyDetailField label="Average Purchase Size" value={survey.purchaseSizeRange} />
            <SurveyDetailField label="Estimated Monthly Purchase Value" value={survey.monthlyPurchaseValue} />
            <SurveyDetailField label="Payment Method" value={survey.paymentMethod} />
            <SurveyDetailField label="Margin Expectation" value={survey.marginExpectation} />
            <SurveyDetailField label="Current Order Method" value={detailList(survey.currentOrderMethod)} />
            <SurveyDetailField label="Main Purchase Driver" value={detailList(survey.mainPurchaseDriver)} />
            <SurveyDetailField label="Store Price Sensitivity" value={survey.priceSensitivity} />
            <SurveyDetailField label="Openness to New Alternative Brand" value={survey.opennessToNewSupplier} />
            <SurveyDetailField label="Main Reason to Try New Supplier" value={detailList(survey.reasonToTryNewSupplier)} />
            <SurveyDetailField label="Willingness to Receive Follow-up" value={survey.willingnessToReceiveFollowUp} />
            <SurveyDetailField label="Surveyor notes" value={detailText(survey.surveyorNotes)} noI18n />
          </Box>
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<PhotoCameraRoundedIcon />} title="Photo Evidence" />
          <Stack spacing={2}>
            <SurveyPhotoEvidenceGrid survey={survey} />
            <Box className="survey-detail-field-grid">
              <SurveyDetailField label="Front" value={evidenceStatus(survey.storefrontPhotoUrl, '')} />
              <SurveyDetailField label="Rack" value={evidenceStatus(survey.interiorPhotoUrl, photoMissingText(survey, 'rack'))} />
              <SurveyDetailField label="PIC" value={evidenceStatus(survey.picPhotoUrl, photoMissingText(survey, 'pic'))} />
              <SurveyDetailField label="Warning" value={survey.warningFlags.length ? survey.warningFlags.map(verificationWarningLabel).join(', ') : 'Normal'} noI18n />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

async function loadAllVisibleSurveyRows() {
  const rows: SurveyHistoryItem[] = [];
  let cursor: string | undefined;
  const pageSize = 500;

  for (let page = 0; page < 24; page += 1) {
    const result = await api.surveys({ limit: pageSize, cursor });
    rows.push(...result.surveys);
    if (result.surveys.length < pageSize) break;

    const nextCursor = result.surveys[result.surveys.length - 1]?.submitTime;
    if (!nextCursor || nextCursor === cursor) break;
    cursor = nextCursor;
  }

  return rows;
}

function CommandCenter() {
  const language = useCurrentLanguage();
  const theme = useTheme();
  const detailDialogFullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [notice, setNotice] = useState<Notice | null>(null);
  const [historyRows, setHistoryRows] = useState<SurveyHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedHistorySurveyor, setSelectedHistorySurveyor] = useState('');
  const [selectedSurveyDetail, setSelectedSurveyDetail] = useState<SurveyHistoryItem | null>(null);
  const [metricDialog, setMetricDialog] = useState<DashboardMetricKey | null>(null);
  const [metricGroupsByKey, setMetricGroupsByKey] = useState<Partial<Record<DashboardMetricKey, DashboardMetricSurveyorGroup[]>>>({});
  const [metricTotalsByKey, setMetricTotalsByKey] = useState<Partial<Record<DashboardMetricKey, number>>>({});
  const [metricGroupsLoading, setMetricGroupsLoading] = useState(false);
  const [metricGroupsError, setMetricGroupsError] = useState('');
  const [expandedMetricSurveyors, setExpandedMetricSurveyors] = useState<Record<string, boolean>>({});
  const [metricStoresByKey, setMetricStoresByKey] = useState<
    Record<string, { loading: boolean; rows: SurveyHistoryItem[]; error: string }>
  >({});
  const [leadMixDialog, setLeadMixDialog] = useState<string | null>(null);
  const [supplierSignalDialog, setSupplierSignalDialog] = useState<SupplierSignalKey | null>(null);
  const [timeSeriesSurveyorId, setTimeSeriesSurveyorId] = useState('all');
  const [timeSeriesMode, setTimeSeriesMode] = useState<DashboardTimeSeriesMode>('runRate');
  const [timeSeriesPayload, setTimeSeriesPayload] = useState<DashboardTimeSeriesPayload | null>(null);
  const [timeSeriesLoading, setTimeSeriesLoading] = useState(true);
  const [timeSeriesError, setTimeSeriesError] = useState('');
  const [timeSeriesRefreshKey, setTimeSeriesRefreshKey] = useState(0);
  const [timeSeriesToggles, setTimeSeriesToggles] = useState<Record<DashboardTimeSeriesOptionalKey, boolean>>(emptyDashboardTimeSeriesToggles);
  const groupedHistory = useMemo(() => groupSurveysBySurveyor(historyRows), [historyRows]);
  const selectedSurveyorHistory = useMemo(
    () => (selectedHistorySurveyor ? groupedHistory[selectedHistorySurveyor] ?? [] : []),
    [groupedHistory, selectedHistorySurveyor],
  );
  const selectedSurveyorSummary = useMemo(() => {
    const rows = selectedSurveyorHistory;
    const total = rows.length;
    const verified = rows.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
    const pending = rows.filter((row) => ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'].includes(row.verificationStatus)).length;
    const revision = rows.filter((row) => row.verificationStatus === 'NEED_REVISION').length;
    const hot = rows.filter((row) => row.leadClassification === 'Hot Lead').length;
    const warning = rows.filter(hasHistoryWarning).length;
    const avgMerchant = total ? Math.round(rows.reduce((sum, row) => sum + row.merchantPotentialScore, 0) / total) : 0;
    const avgQuality = total ? Math.round(rows.reduce((sum, row) => sum + row.dataQualityScore, 0) / total) : 0;
    const latestRow = rows.reduce<SurveyHistoryItem | null>((latest, row) => {
      if (!latest) return row;
      return surveyTimestamp(row.submitTime) > surveyTimestamp(latest.submitTime) ? row : latest;
    }, null);

    return {
      total,
      verified,
      pending,
      revision,
      hot,
      warning,
      avgMerchant,
      avgQuality,
      validRate: pct(verified, total),
      latestLabel: latestRow ? `${formatSurveyHistoryDate(latestRow.submitTime, language)} ${formatSurveyHistoryTime(latestRow.submitTime, language)}` : '-',
    };
  }, [language, selectedSurveyorHistory]);
  const dashboardMetricCards = useMemo(() => {
    if (!historyRows.length) return emptyDashboardMetricCards;

    const submitted = historyRows.length;
    const verified = historyRows.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
    const hot = historyRows.filter((row) => row.leadClassification === 'Hot Lead').length;
    const warning = historyRows.filter(hasHistoryWarning).length;

    return [
      {
        metric: 'submitted' as const,
        label: 'Submitted visits',
        value: submitted.toLocaleString('id-ID'),
        helper: `${Math.round((submitted / finalCampaignTarget) * 100)}% dari target 5,000`,
        progress: Math.min(100, (submitted / finalCampaignTarget) * 100),
        icon: StorefrontRoundedIcon,
        tone: '#2fd0a8',
      },
      {
        metric: 'verified' as const,
        label: 'Verified valid',
        value: verified.toLocaleString('id-ID'),
        helper: `${submitted ? ((verified / submitted) * 100).toFixed(1) : '0.0'}% valid rate`,
        progress: submitted ? Math.min(100, (verified / submitted) * 100) : 0,
        icon: VerifiedRoundedIcon,
        tone: '#61c8ff',
      },
      {
        metric: 'hot' as const,
        label: 'Hot leads',
        value: hot.toLocaleString('id-ID'),
        helper: 'A/A+ + terbuka + WA',
        progress: submitted ? Math.min(100, (hot / submitted) * 100) : 0,
        icon: FlashOnRoundedIcon,
        tone: '#f5c84c',
      },
      {
        metric: 'warnings' as const,
        label: 'Warnings',
        value: warning.toLocaleString('id-ID'),
        helper: 'GPS, foto, duplicate, revision',
        progress: submitted ? Math.min(100, (warning / submitted) * 100) : 0,
        icon: WarningAmberRoundedIcon,
        tone: '#ff8b73',
      },
    ];
  }, [historyRows]);
  const timeSeriesSurveyorOptions = timeSeriesPayload?.surveyors ?? [];
  const activeTimeSeriesSurveyorId =
    timeSeriesSurveyorId === 'all' || timeSeriesSurveyorOptions.some((surveyor) => surveyor.id === timeSeriesSurveyorId) ? timeSeriesSurveyorId : 'all';
  const timeSeriesPoints = useMemo(() => decorateDashboardTimeSeriesPoints(timeSeriesPayload?.points ?? [], language), [language, timeSeriesPayload]);
  const timeSeriesSummary = timeSeriesPayload?.summary;
  const timeSeriesScopedHistoryRows = useMemo(
    () =>
      activeTimeSeriesSurveyorId === 'all'
        ? historyRows
        : historyRows.filter((row) => (row.surveyorId || row.surveyorName) === activeTimeSeriesSurveyorId),
    [activeTimeSeriesSurveyorId, historyRows],
  );
  const surveyorProgressRows = useMemo(() => {
    if (!historyRows.length) return [];

    return Object.entries(groupedHistory)
      .map(([name, rows]) => {
        const done = rows.length;
        const valid = rows.filter((row) => row.verificationStatus === 'VERIFIED_VALID').length;
        const hot = rows.filter((row) => row.leadClassification === 'Hot Lead').length;
        const warning = rows.filter(hasHistoryWarning).length;

        return {
          name,
          city: rows[0]?.city ?? '-',
          target: campaignElapsedDays * dailyTargetPerSurveyor,
          done,
          valid,
          hot,
          warning,
        };
      })
      .sort((left, right) => right.done - left.done || left.name.localeCompare(right.name));
  }, [groupedHistory, historyRows]);
  const activeTimeSeriesSurveyorLabel =
    activeTimeSeriesSurveyorId === 'all'
      ? 'All surveyors'
      : timeSeriesSurveyorOptions.find((surveyor) => surveyor.id === activeTimeSeriesSurveyorId)?.name ?? 'Filtered';
  const leadMixSummaries = useMemo(() => buildLeadMixSummaries(timeSeriesScopedHistoryRows), [timeSeriesScopedHistoryRows]);
  const activeLeadMix = leadMixSummaries.find((summary) => summary.label === leadMixDialog) ?? null;
  const supplierSignalSummaries = useMemo(() => buildSupplierSignalSummaries(timeSeriesScopedHistoryRows), [timeSeriesScopedHistoryRows]);
  const activeSupplierSignal = supplierSignalSummaries.find((signal) => signal.key === supplierSignalDialog) ?? null;

  useEffect(() => {
    let active = true;
    loadAllVisibleSurveyRows()
      .then((result) => {
        if (!active) return;
        setHistoryRows(result);
      })
      .catch(() => {
        if (active) setNotice({ message: 'History survey dari database belum bisa dimuat.', severity: 'warning' });
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setTimeSeriesLoading(true);
    setTimeSeriesError('');
    api
      .dashboardTimeSeries({ mode: timeSeriesMode, surveyorId: activeTimeSeriesSurveyorId })
      .then((result) => {
        if (!active) return;
        setTimeSeriesPayload(result);
      })
      .catch((error) => {
        if (!active) return;
        setTimeSeriesPayload(null);
        setTimeSeriesError(error instanceof Error ? error.message : 'Trend survey belum bisa dimuat dari backend.');
      })
      .finally(() => {
        if (active) setTimeSeriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeTimeSeriesSurveyorId, timeSeriesMode, timeSeriesRefreshKey]);

  const loadMetricGroups = async (metric: DashboardMetricKey) => {
    setMetricGroupsLoading(true);
    setMetricGroupsError('');
    try {
      const result = await api.dashboardMetricSurveyors(metric);
      setMetricGroupsByKey((current) => ({ ...current, [metric]: result.groups }));
      setMetricTotalsByKey((current) => ({ ...current, [metric]: result.total }));
    } catch (error) {
      setMetricGroupsError(error instanceof Error ? error.message : 'Drill-down metrik gagal dimuat.');
    } finally {
      setMetricGroupsLoading(false);
    }
  };

  const openMetricDialog = (metric: DashboardMetricKey) => {
    setMetricDialog(metric);
    setExpandedMetricSurveyors({});
    setMetricGroupsError('');
    if (!metricGroupsByKey[metric]) {
      loadMetricGroups(metric);
    }
  };

  const loadMetricStores = async (metric: DashboardMetricKey, surveyorId: string) => {
    const cacheKey = dashboardMetricStoreCacheKey(metric, surveyorId);
    setMetricStoresByKey((current) => ({
      ...current,
      [cacheKey]: { loading: true, rows: current[cacheKey]?.rows ?? [], error: '' },
    }));
    try {
      const result = await api.dashboardMetricStores(metric, surveyorId, { limit: 500 });
      setMetricStoresByKey((current) => ({
        ...current,
        [cacheKey]: { loading: false, rows: result.stores, error: '' },
      }));
    } catch (error) {
      setMetricStoresByKey((current) => ({
        ...current,
        [cacheKey]: {
          loading: false,
          rows: current[cacheKey]?.rows ?? [],
          error: error instanceof Error ? error.message : 'List toko gagal dimuat.',
        },
      }));
    }
  };

  const toggleMetricSurveyor = (metric: DashboardMetricKey, surveyorId: string) => {
    const cacheKey = dashboardMetricStoreCacheKey(metric, surveyorId);
    const nextExpanded = !expandedMetricSurveyors[cacheKey];
    setExpandedMetricSurveyors((current) => ({ ...current, [cacheKey]: nextExpanded }));
    if (nextExpanded && !metricStoresByKey[cacheKey]) {
      loadMetricStores(metric, surveyorId);
    }
  };

  const toggleTimeSeriesMetric = (metric: DashboardTimeSeriesOptionalKey) => {
    setTimeSeriesToggles((current) => ({ ...current, [metric]: !current[metric] }));
  };

  const openSubmittedSurveyDetail = (row: SurveyHistoryItem) => {
    setSelectedHistorySurveyor('');
    setMetricDialog(null);
    setLeadMixDialog(null);
    setSupplierSignalDialog(null);
    setSelectedSurveyDetail(row);
    api
      .survey(row.id)
      .then((result) => {
        setSelectedSurveyDetail((current) => (current?.id === row.id ? result.survey : current));
      })
      .catch(() => undefined);
  };

  const exportProgress = async () => {
    try {
      const { downloadXlsx } = await import('./utils/xlsx');
      downloadXlsx(
        'klwt-surveyor-progress.xlsx',
        surveyorProgressRows.map((row) => ({
          surveyor: row.name,
          area: row.city,
          target: row.target,
          submitted: row.done,
          verified: row.valid,
          hotLead: row.hot,
          warning: row.warning,
        })),
        'Surveyor Progress',
      );
      setNotice({ message: 'Export Surveyor Progress dibuat dalam format XLSX.', severity: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Export Surveyor Progress gagal dibuat.', severity: 'error' });
    }
  };
  const exportSurveyorHistory = async (surveyor: string, rows: SurveyHistoryItem[]) => {
    try {
      const { downloadXlsx } = await import('./utils/xlsx');
      downloadXlsx(
        `klwt-submitted-store-history-${surveyor.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.xlsx`,
        rows.map((row) => ({
          submitTime: row.submitTime,
          surveyor: row.surveyorName,
          manager: row.managerName,
          store: row.storeName,
          location: `${row.province} / ${row.city} / ${row.district} / ${row.village}`,
          outcome: row.visitOutcome,
          lead: row.leadClassification,
          merchantGrade: row.merchantGrade,
          dataQuality: row.dataQualityGrade,
          verificationStatus: row.verificationStatus,
        })),
        'Submitted History',
      );
      setNotice({ message: `History submit toko ${surveyor} dibuat dalam format XLSX.`, severity: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : `History submit toko ${surveyor} gagal dibuat.`, severity: 'error' });
    }
  };
  const activeMetricGroups = metricDialog ? metricGroupsByKey[metricDialog] ?? [] : [];
  const activeMetricTotal = metricDialog ? metricTotalsByKey[metricDialog] ?? 0 : 0;

  return (
    <Stack spacing={3} className="dashboard-stack">
      <Box className="metric-grid">
        {dashboardMetricCards.map((metric) => (
          <MetricCard key={metric.label} {...metric} onOpen={() => openMetricDialog(metric.metric)} />
        ))}
      </Box>

      <Box className="dashboard-insight-section">
        <DashboardTimeSeriesPanel
          points={timeSeriesPoints}
          loading={timeSeriesLoading}
          error={timeSeriesError}
          language={language}
          summary={timeSeriesSummary}
          selectedSurveyorId={activeTimeSeriesSurveyorId}
          surveyorOptions={timeSeriesSurveyorOptions}
          mode={timeSeriesMode}
          activeOptionalSeries={timeSeriesToggles}
          onSurveyorChange={setTimeSeriesSurveyorId}
          onModeChange={setTimeSeriesMode}
          onToggleSeries={toggleTimeSeriesMetric}
          onRefresh={() => setTimeSeriesRefreshKey((key) => key + 1)}
        />

        <Paper className="section-panel lead-mix-panel">
          <SectionTitle
            icon={<AnalyticsRoundedIcon />}
            title="Lead Mix"
            action={<Chip size="small" label={activeTimeSeriesSurveyorLabel} variant="outlined" />}
          />
          <LeadMixPanel
            summaries={leadMixSummaries}
            total={timeSeriesScopedHistoryRows.length}
            language={language}
            onOpen={(label) => setLeadMixDialog(label)}
          />
        </Paper>

        <Paper className="section-panel supplier-signals-panel">
          <SectionTitle
            icon={<LocalShippingRoundedIcon />}
            title="Supplier Signals"
            action={<Chip size="small" label={`${timeSeriesScopedHistoryRows.length.toLocaleString(languageLocale(language))} survey`} variant="outlined" />}
          />
          <Box className="supplier-signals-grid">
            {supplierSignalSummaries.map((signal) => (
              <SupplierSignalCard
                key={signal.key}
                signal={signal}
                language={language}
                onOpen={() => setSupplierSignalDialog(signal.key)}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      <Box className="dashboard-grid field-team-progress-grid">
        <Paper className="section-panel wide field-team-progress-panel">
          <SectionTitle
            icon={<GroupsRoundedIcon />}
            title="Field Team Progress"
            action={<Button startIcon={<DownloadRoundedIcon />} onClick={exportProgress}>Export</Button>}
          />
          <Typography variant="body2" color="text.secondary" mb={2}>
            Klik baris surveyor untuk melihat histori submit toko.
          </Typography>
          <Table size="small" className="surveyor-progress-table">
            <TableHead>
              <TableRow>
                <TableCell>Surveyor</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Hot</TableCell>
                <TableCell>Warning</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!surveyorProgressRows.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">
                      No backend data yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {surveyorProgressRows.map((row) => (
                <TableRow
                  key={row.name}
                  hover
                  role="button"
                  tabIndex={0}
                  className="surveyor-progress-row"
                  onClick={() => setSelectedHistorySurveyor(row.name)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedHistorySurveyor(row.name);
                    }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar>{row.name.slice(0, 1)}</Avatar>
                      <Typography className="surveyor-history-trigger" fontWeight={900}>
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Stack spacing={0.7}>
                      <Typography variant="caption">
                        {row.done}/{row.target} toko
                      </Typography>
                      <LinearProgress variant="determinate" value={Math.min(100, (row.done / row.target) * 100)} />
                    </Stack>
                  </TableCell>
                  <TableCell>{row.valid}</TableCell>
                  <TableCell>{row.hot}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.warning} color={row.warning > 1 ? 'warning' : 'default'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack spacing={1.2} className="surveyor-card-list">
            {surveyorProgressRows.map((row) => (
              <Paper
                key={row.name}
                className="surveyor-progress-card"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedHistorySurveyor(row.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedHistorySurveyor(row.name);
                  }
                }}
              >
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar>{row.name.slice(0, 1)}</Avatar>
                    <Box minWidth={0} flex={1}>
                      <Typography className="surveyor-history-trigger card-trigger" fontWeight={900}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.city}
                      </Typography>
                    </Box>
                    <Chip size="small" label={`${row.done}/${row.target}`} color={row.done >= row.target ? 'success' : 'warning'} />
                  </Stack>
                  <LinearProgress variant="determinate" value={Math.min(100, (row.done / row.target) * 100)} />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip size="small" label={`${row.valid} verified`} variant="outlined" />
                    <Chip size="small" label={`${row.hot} hot`} color="secondary" variant="outlined" />
                    <Chip size="small" label={`${row.warning} warning`} color={row.warning > 1 ? 'warning' : 'default'} />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>

      </Box>
      <Dialog open={Boolean(activeLeadMix)} onClose={() => setLeadMixDialog(null)} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} gap={1.4}>
            <Box minWidth={0}>
              <Typography variant="h6">{activeLeadMix?.label ?? 'Lead Mix'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {activeTimeSeriesSurveyorLabel} - toko dalam kategori lead terpilih.
              </Typography>
            </Box>
            {activeLeadMix && (
              <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Chip size="small" label={`${activeLeadMix.rate}%`} sx={{ bgcolor: alpha(activeLeadMix.color, 0.16), color: activeLeadMix.color }} />
                <Chip size="small" label={`${activeLeadMix.count}/${activeLeadMix.total} toko`} variant="outlined" />
                <Chip size="small" label={`${activeLeadMix.warningCount} warning`} color={activeLeadMix.warningCount ? 'warning' : 'default'} variant="outlined" />
              </Stack>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {activeLeadMix && (
            <Stack spacing={1.4}>
              <Box className="lead-mix-dialog-summary">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Avg merchant
                  </Typography>
                  <Typography fontWeight={950}>M {activeLeadMix.avgMerchant}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Avg data quality
                  </Typography>
                  <Typography fontWeight={950}>DQ {activeLeadMix.avgQuality}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kota dominan
                  </Typography>
                  <Typography fontWeight={950} data-no-i18n>
                    {activeLeadMix.topCityLabel}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Submit terbaru
                  </Typography>
                  <Typography fontWeight={950}>
                    {activeLeadMix.latestSubmitTime ? formatSurveyHistoryDate(activeLeadMix.latestSubmitTime, language) : '-'}
                  </Typography>
                </Box>
              </Box>
              {!activeLeadMix.rows.length && (
                <Box className="history-empty-card">
                  <Typography fontWeight={900}>Tidak ada toko pada kategori ini.</Typography>
                </Box>
              )}
              <Stack spacing={1} className="lead-mix-store-list">
                {activeLeadMix.rows.map((row) => (
                  <Box
                    key={row.id}
                    className="lead-mix-store"
                    role="button"
                    tabIndex={0}
                    onClick={() => openSubmittedSurveyDetail(row)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openSubmittedSurveyDetail(row);
                      }
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                      <Box minWidth={0}>
                        <Typography fontWeight={900} data-no-i18n>
                          {row.storeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.city} / {row.district} - {formatSurveyHistoryDate(row.submitTime, language)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={`M ${row.merchantPotentialScore}`} color={row.merchantPotentialScore >= 70 ? 'success' : row.merchantPotentialScore >= 45 ? 'warning' : 'default'} />
                        <Chip size="small" label={`DQ ${row.dataQualityScore}`} color={row.dataQualityScore >= 80 ? 'success' : row.dataQualityScore >= 60 ? 'warning' : 'error'} variant="outlined" />
                        <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(activeSupplierSignal)} onClose={() => setSupplierSignalDialog(null)} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} gap={1.4}>
            <Box minWidth={0}>
              <Typography variant="h6">{activeSupplierSignal?.label ?? 'Supplier signal'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {activeSupplierSignal?.caption ?? ''}
              </Typography>
            </Box>
            {activeSupplierSignal && (
              <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Chip size="small" label={`${activeSupplierSignal.rate}%`} color={activeSupplierSignal.tone} />
                <Chip size="small" label={`${activeSupplierSignal.count}/${activeSupplierSignal.total} toko`} variant="outlined" />
              </Stack>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {activeSupplierSignal && (
            <Stack spacing={1.4}>
              <Box className="supplier-signal-dialog-summary">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    7 hari terakhir
                  </Typography>
                  <Typography fontWeight={950}>
                    {activeSupplierSignal.recentRate}% ({activeSupplierSignal.recentCount}/{activeSupplierSignal.recentTotal})
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Kota dominan
                  </Typography>
                  <Typography fontWeight={950} data-no-i18n>
                    {activeSupplierSignal.topCityLabel}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {activeSupplierSignal.insight}
              </Typography>
              {!activeSupplierSignal.rows.length && (
                <Box className="history-empty-card">
                  <Typography fontWeight={900}>Tidak ada toko untuk sinyal ini.</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ubah filter surveyor atau tunggu data survey baru masuk.
                  </Typography>
                </Box>
              )}
              <Stack spacing={1} className="supplier-signal-store-list">
                {activeSupplierSignal.rows.map((row) => (
                  <Box
                    key={row.id}
                    className="supplier-signal-store"
                    role="button"
                    tabIndex={0}
                    onClick={() => openSubmittedSurveyDetail(row)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openSubmittedSurveyDetail(row);
                      }
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                      <Box minWidth={0}>
                        <Typography fontWeight={900} data-no-i18n>
                          {row.storeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.city} / {row.district} - {formatSurveyHistoryDate(row.submitTime, language)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={row.leadClassification} color={row.leadClassification === 'Hot Lead' ? 'secondary' : 'default'} />
                        <Chip size="small" label={`DQ ${row.dataQualityScore}`} color={row.dataQualityScore >= 80 ? 'success' : row.dataQualityScore >= 60 ? 'warning' : 'error'} variant="outlined" />
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(metricDialog)} onClose={() => setMetricDialog(null)} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box minWidth={0}>
              <Typography variant="h6">
                {metricDialog ? dashboardMetricTitle(metricDialog, language) : 'Metric drill-down'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metricDialog ? dashboardMetricDescription(metricDialog, language) : ''}
              </Typography>
            </Box>
            {metricDialog && (
              <Chip
                size="small"
                label={`${activeMetricTotal.toLocaleString(languageLocale(language))} toko`}
                sx={{ bgcolor: alpha(dashboardMetricTone(metricDialog), 0.14), color: dashboardMetricTone(metricDialog) }}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.2}>
            {metricGroupsLoading && <LinearProgress />}
            {metricGroupsError && <Alert severity="error">{metricGroupsError}</Alert>}
            {!metricGroupsLoading && !metricGroupsError && activeMetricGroups.length === 0 && (
              <Paper className="history-empty-card">
                <Typography fontWeight={900}>Tidak ada toko untuk metrik ini.</Typography>
                <Typography variant="body2" color="text.secondary">
                  Data akan muncul saat ada survey yang memenuhi kriteria metrik.
                </Typography>
              </Paper>
            )}
            {metricDialog &&
              activeMetricGroups.map((group) => {
                const cacheKey = dashboardMetricStoreCacheKey(metricDialog, group.surveyorId);
                const expanded = Boolean(expandedMetricSurveyors[cacheKey]);
                const storeState = metricStoresByKey[cacheKey];
                return (
                  <Paper key={group.surveyorId} className="metric-drilldown-group">
                    <Button className="metric-drilldown-toggle" fullWidth onClick={() => toggleMetricSurveyor(metricDialog, group.surveyorId)}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ xs: 'stretch', md: 'center' }} width="100%">
                        <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0} flex={1}>
                          {expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                          <Avatar>{group.surveyorName.slice(0, 1)}</Avatar>
                          <Box minWidth={0} textAlign="left">
                            <Typography fontWeight={900} data-no-i18n>
                              {group.surveyorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.managerName || 'Manager belum terisi'} - terakhir{' '}
                              {group.latestSubmitTime ? formatSurveyHistoryDate(group.latestSubmitTime, language) : '-'}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                          <Chip size="small" label={`${group.count} toko`} color="primary" />
                          <Chip size="small" label={`${group.verified} valid`} color={group.verified ? 'success' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${group.hot} hot`} color={group.hot ? 'secondary' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${group.warnings} warning`} color={group.warnings ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                        </Stack>
                      </Stack>
                    </Button>
                    {expanded && (
                      <Box className="metric-drilldown-store-panel">
                        {storeState?.loading && <LinearProgress />}
                        {storeState?.error && <Alert severity="error">{storeState.error}</Alert>}
                        {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            Tidak ada toko pada grup ini.
                          </Typography>
                        )}
                        <Stack spacing={1}>
                          {(storeState?.rows ?? []).map((row) => (
                            <Paper
                              key={row.id}
                              className="metric-drilldown-store"
                              role="button"
                              tabIndex={0}
                              onClick={() => openSubmittedSurveyDetail(row)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  openSubmittedSurveyDetail(row);
                                }
                              }}
                            >
                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                                <Box minWidth={0}>
                                  <Typography fontWeight={900} data-no-i18n>
                                    {row.storeName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.city} / {row.district} / {row.village} - {formatSubmittedAt(row.submitTime)}
                                  </Typography>
                                </Box>
                                <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                                  <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={leadChipColor(row.leadClassification)} variant="outlined" />
                                  <Chip size="small" label={`M ${row.merchantGrade} / DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)}`} variant="outlined" />
                                  <Chip size="small" label={compactVerificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
                                </Stack>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                );
              })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricDialog(null)}>Tutup</Button>
          {metricDialog && (
            <Button variant="outlined" onClick={() => loadMetricGroups(metricDialog)} disabled={metricGroupsLoading}>
              Refresh
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(selectedHistorySurveyor)} onClose={() => setSelectedHistorySurveyor('')} fullWidth maxWidth="md" className="surveyor-history-dialog">
        <DialogTitle>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar>{selectedHistorySurveyor.slice(0, 1)}</Avatar>
            <Box minWidth={0}>
              <Typography variant="h6" data-no-i18n>
                {selectedHistorySurveyor}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Histori Submit Toko
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {!historyLoading && selectedSurveyorHistory.length > 0 && (
            <Stack spacing={1.4} mb={2} className="history-summary-wrap">
              <Paper className="history-summary-panel">
                <Stack className="history-summary-heading" direction={{ xs: 'column', md: 'row' }} spacing={1.4} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Box minWidth={0}>
                    <Typography variant="overline" className="history-summary-eyebrow">
                      {localCopy(language, { id: 'Ringkasan hasil survey', en: 'Survey result summary', zh: '\u8c03\u7814\u7ed3\u679c\u6458\u8981' })}
                    </Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {selectedSurveyorSummary.total.toLocaleString(languageLocale(language))}{' '}
                      {localCopy(language, { id: 'submit toko', en: 'store submits', zh: '\u95e8\u5e97\u63d0\u4ea4' })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {localCopy(language, { id: 'Terakhir submit', en: 'Latest submit', zh: '\u6700\u65b0\u63d0\u4ea4' })}: {selectedSurveyorSummary.latestLabel}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap className="history-chip-row">
                    <Chip
                      size="small"
                      label={`${selectedSurveyorSummary.verified} ${localCopy(language, { id: 'Valid', en: 'Valid', zh: '\u6709\u6548' })}`}
                      color="success"
                      variant="outlined"
                      reason={surveyorHistoryStatusReason('valid', selectedSurveyorSummary.verified, selectedSurveyorSummary.total, language)}
                    />
                    <Chip
                      size="small"
                      label={`${selectedSurveyorSummary.pending} ${localCopy(language, { id: 'Menunggu', en: 'Waiting', zh: '\u5f85\u5ba1\u6838' })}`}
                      color="info"
                      variant="outlined"
                      reason={surveyorHistoryStatusReason('waiting', selectedSurveyorSummary.pending, selectedSurveyorSummary.total, language)}
                    />
                    {!!selectedSurveyorSummary.revision && (
                      <Chip
                        size="small"
                        label={`${selectedSurveyorSummary.revision} ${localCopy(language, { id: 'Revisi', en: 'Revision', zh: '\u9700\u4fee\u8ba2' })}`}
                        color="warning"
                        variant="outlined"
                        reason={surveyorHistoryStatusReason('revision', selectedSurveyorSummary.revision, selectedSurveyorSummary.total, language)}
                      />
                    )}
                  </Stack>
                </Stack>
                <Box className="history-summary-grid">
                  {[
                    {
                      key: 'validRate' as const,
                      label: localCopy(language, { id: 'Valid rate', en: 'Valid rate', zh: '\u6709\u6548\u7387' }),
                      value: selectedSurveyorSummary.validRate,
                      helper: localCopy(language, { id: 'disetujui verifikator', en: 'approved by verifier', zh: '\u5df2\u7531\u5ba1\u6838\u5458\u6279\u51c6' }),
                    },
                    {
                      key: 'hot' as const,
                      label: localCopy(language, { id: 'Hot lead', en: 'Hot lead', zh: '\u9ad8\u610f\u5411\u7ebf\u7d22' }),
                      value: selectedSurveyorSummary.hot.toLocaleString(languageLocale(language)),
                      helper: localCopy(language, { id: 'prioritas follow-up', en: 'follow-up priority', zh: '\u8ddf\u8fdb\u4f18\u5148' }),
                    },
                    {
                      key: 'warning' as const,
                      label: localCopy(language, { id: 'Perlu perhatian', en: 'Needs attention', zh: '\u9700\u8981\u5173\u6ce8' }),
                      value: selectedSurveyorSummary.warning.toLocaleString(languageLocale(language)),
                      helper: localCopy(language, { id: 'warning GPS, foto, atau status', en: 'GPS, photo, or status warning', zh: 'GPS\u3001\u7167\u7247\u6216\u72b6\u6001\u9884\u8b66' }),
                    },
                    {
                      key: 'averageScore' as const,
                      label: localCopy(language, { id: 'Rata-rata skor', en: 'Average score', zh: '\u5e73\u5747\u5206' }),
                      value: `M ${selectedSurveyorSummary.avgMerchant} / DQ ${selectedSurveyorSummary.avgQuality}`,
                      helper: localCopy(language, { id: 'Merchant / Data Quality', en: 'Merchant / Data Quality', zh: '\u5546\u6237 / \u6570\u636e\u8d28\u91cf' }),
                    },
                  ].map((item) => (
                    <Tooltip
                      key={item.key}
                      arrow
                      placement="top"
                      title={surveyorHistorySummaryTooltip({
                        kind: item.key,
                        label: item.label,
                        value: item.value,
                        helper: item.helper,
                        rows: selectedSurveyorHistory,
                        summary: selectedSurveyorSummary,
                        language,
                      })}
                      slotProps={{ tooltip: { className: 'explain-tooltip' } }}
                    >
                      <Box className="history-summary-stat" tabIndex={0}>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography className="history-summary-value">{item.value}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.helper}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}
                </Box>
              </Paper>
              <Typography variant="body2" color="text.secondary">
                {localCopy(language, { id: 'Klik row toko untuk membuka detail survey.', en: 'Click a store row to open the survey detail.', zh: '\u70b9\u51fb\u95e8\u5e97\u884c\u6253\u5f00\u8c03\u7814\u8be6\u60c5\u3002' })}
              </Typography>
            </Stack>
          )}
          {historyLoading ? (
            <Paper className="history-empty-card">
              <Typography fontWeight={900}>Memuat history submit dari database...</Typography>
            </Paper>
          ) : selectedSurveyorHistory.length ? (
            <Stack spacing={1.1} className="history-store-list dialog-history-list">
              {selectedSurveyorHistory.map((row) => (
                <Paper
                  key={row.id}
                  className="history-store-card clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    openSubmittedSurveyDetail(row);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openSubmittedSurveyDetail(row);
                    }
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Box minWidth={0}>
                      <Typography fontWeight={900} data-no-i18n>
                        {row.storeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.city} / {row.district} / {row.village} - {formatSubmittedAt(row.submitTime)}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap className="history-chip-row">
                      <Chip size="small" label={compactVisitOutcomeLabel(row.visitOutcome, language)} variant="outlined" reason={historyVisitOutcomeReason(row, language)} />
                      <Chip
                        size="small"
                        label={leadClassificationLabel(row.leadClassification, language)}
                        color={leadChipColor(row.leadClassification)}
                        reason={historyLeadReason(row, language)}
                      />
                      <Chip
                        size="small"
                        label={`M ${row.merchantGrade} / DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)}`}
                        variant="outlined"
                        reason={historyScoreReason(row, language)}
                      />
                      <Chip
                        size="small"
                        label={compactVerificationStatusLabel(row.verificationStatus, language)}
                        color={statusChipColor(row.verificationStatus)}
                        variant="outlined"
                        reason={historyVerificationReason(row, language)}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper className="history-empty-card">
              <Typography fontWeight={900}>Tidak ada histori submit untuk surveyor ini.</Typography>
              <Typography variant="body2" color="text.secondary">
                Data akan muncul setelah surveyor submit dari PWA Surveyor.
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedHistorySurveyor('')}>Tutup</Button>
          <Button
            variant="contained"
            startIcon={<DownloadRoundedIcon />}
            onClick={() => exportSurveyorHistory(selectedHistorySurveyor, selectedSurveyorHistory)}
            disabled={!selectedSurveyorHistory.length}
          >
            Export Histori
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(selectedSurveyDetail)}
        onClose={() => setSelectedSurveyDetail(null)}
        fullWidth
        maxWidth="lg"
        fullScreen={detailDialogFullScreen}
        scroll="paper"
      >
        <DialogContent className="survey-detail-dialog-content">
          {selectedSurveyDetail && <SubmittedSurveyDetailPage survey={selectedSurveyDetail} onBack={() => setSelectedSurveyDetail(null)} mode="dialog" />}
        </DialogContent>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function SubmittedHistoryPanel({
  groupedHistory,
  loading,
  expanded,
  onToggle,
  onExpandAll,
  onCollapseAll,
  onExport,
}: {
  groupedHistory: Record<string, SurveyHistoryItem[]>;
  loading: boolean;
  expanded: Record<string, boolean>;
  onToggle: (surveyor: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onExport: () => void;
}) {
  const language = useCurrentLanguage();
  const surveyorEntries = Object.entries(groupedHistory);
  const totalRows = surveyorEntries.reduce((total, [, rows]) => total + rows.length, 0);

  return (
    <Paper className="section-panel submitted-history-panel">
      <SectionTitle
        icon={<HistoryRoundedIcon />}
        title="Submitted Report History"
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`${totalRows} records`} color="primary" variant="outlined" />
            <Button size="small" startIcon={<DownloadRoundedIcon />} onClick={onExport} disabled={!totalRows}>
              Export
            </Button>
          </Stack>
        }
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1.2} mb={2}>
        <Typography variant="body2" color="text.secondary">
          Semua submit survey yang tersimpan di database, dikelompokkan per surveyor.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={onExpandAll} disabled={!totalRows}>
            Expand all
          </Button>
          <Button size="small" variant="outlined" onClick={onCollapseAll} disabled={!totalRows}>
            Collapse all
          </Button>
        </Stack>
      </Stack>
      {loading ? (
        <Paper className="history-empty-card">
          <Typography fontWeight={900}>Memuat history submit dari database...</Typography>
        </Paper>
      ) : surveyorEntries.length ? (
        <Stack spacing={1.2}>
          {surveyorEntries.map(([surveyor, rows]) => {
            const open = Boolean(expanded[surveyor]);
            const hotLeads = rows.filter((row) => row.leadClassification === 'Hot Lead').length;

            return (
              <Paper key={surveyor} className="history-group">
                <Button className="history-group-toggle" fullWidth onClick={() => onToggle(surveyor)}>
                  <Stack direction="row" spacing={1.2} alignItems="center" width="100%">
                    {open ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                    <Avatar>{surveyor.slice(0, 1)}</Avatar>
                    <Box minWidth={0} flex={1} textAlign="left">
                      <Typography fontWeight={900}>{surveyor}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rows[0]?.managerName ?? 'Manager belum terisi'}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={`${rows.length} ${localCopy(language, { id: 'submit', en: 'submits', zh: '\u63d0\u4ea4' })}`}
                      color="primary"
                    />
                    <Chip
                      size="small"
                      label={`${hotLeads} ${localCopy(language, { id: 'hot', en: 'hot', zh: '\u9ad8\u610f\u5411' })}`}
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                </Button>
                {open && (
                  <Stack spacing={1} className="history-store-list">
                    {rows.map((row) => (
                      <Paper key={row.id} className="history-store-card">
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                          <Box minWidth={0}>
                            <Typography fontWeight={900}>{row.storeName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.city} / {row.district} / {row.village} - {formatSubmittedAt(row.submitTime)}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap className="history-chip-row">
                            <Chip size="small" label={compactVisitOutcomeLabel(row.visitOutcome, language)} variant="outlined" />
                            <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={leadChipColor(row.leadClassification)} />
                            <Chip size="small" label={`M ${row.merchantGrade} / DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)}`} variant="outlined" />
                            <Chip size="small" label={compactVerificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
                          </Stack>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Paper className="history-empty-card">
          <Typography fontWeight={900}>Belum ada survey tersubmit di database.</Typography>
          <Typography variant="body2" color="text.secondary">
            Data akan muncul setelah surveyor mengirim laporan dari Ruang Kerja Surveyor.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}

function MetricCard({
  metric,
  label,
  value,
  helper,
  progress,
  icon: Icon,
  tone,
  onOpen,
}: {
  metric: DashboardMetricKey;
  label: string;
  value: string;
  helper: string;
  progress: number;
  icon: typeof StorefrontRoundedIcon;
  tone: string;
  onOpen?: () => void;
}) {
  const language = useCurrentLanguage();
  const detail = metricCardDetail(label, value, helper, language);

  return (
    <Card
      className="metric-card"
      tabIndex={0}
      role="button"
      data-metric={metric}
      aria-label={`${translateInline(label, language)}. ${value}. ${helper}. ${detail}`}
      sx={{ '--metric-tone': tone } as React.CSSProperties}
      onClick={onOpen}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onOpen) {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2">
              {translateInline(label, language)}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(tone, 0.16), color: tone }}>
            <Icon />
          </Avatar>
        </Stack>
        <Stack spacing={1} mt={2}>
          <LinearProgress variant="determinate" value={progress} sx={{ '& .MuiLinearProgress-bar': { bgcolor: tone } }} />
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
        <Typography className="metric-card-detail" variant="caption">
          {detail}
        </Typography>
      </CardContent>
    </Card>
  );
}

function AssignmentsPage() {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [surveyorOptions, setSurveyorOptions] = useState<ApiUser[]>([]);
  const [visitDate, setVisitDate] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dialogMode, setDialogMode] = useState<'import' | 'assign' | 'reassign' | null>(null);
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [assignmentLocationOptions, setAssignmentLocationOptions] = useState({
    provinces: [] as string[],
    cities: [] as string[],
    districts: [] as string[],
    villages: [] as string[],
  });
  const [assignmentLocationValid, setAssignmentLocationValid] = useState<boolean | null>(null);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentRow>(emptyAssignmentForm);
  const cities = useMemo(() => ['All', ...Array.from(new Set(rows.map((row) => row.city)))], [rows]);
  const managers = useMemo(() => ['All', ...Array.from(new Set(rows.map((row) => row.manager)))], [rows]);
  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const haystack = `${row.store} ${row.province} ${row.city} ${row.district} ${row.village} ${row.surveyor}`.toLowerCase();
        const matchesDate = !visitDate || row.visitDate === visitDate;
        const matchesCity = cityFilter === 'All' || row.city === cityFilter;
        const matchesManager = managerFilter === 'All' || row.manager === managerFilter;
        return matchesDate && matchesCity && matchesManager && haystack.includes(search.toLowerCase());
      }),
    [cityFilter, managerFilter, rows, search, visitDate],
  );
  const areaCapacity = useMemo(
    () =>
      Array.from(new Set(filteredRows.map((row) => row.city))).map((city) => {
        const count = filteredRows.filter((row) => row.city === city).length;
        return { city, count, progress: Math.min(100, (count / dailyTargetPerSurveyor) * 100) };
      }),
    [filteredRows],
  );
  const assignmentCoordinateError = useMemo(
    () => optionalCoordinatePairError(assignmentForm.latitude, assignmentForm.longitude),
    [assignmentForm.latitude, assignmentForm.longitude],
  );

  useEffect(() => {
    let active = true;
    setLoadingAssignments(true);
    Promise.all([api.assignments(), api.teamSurveyors()])
      .then(([assignmentResult, surveyorResult]) => {
        if (!active) return;
        setRows(assignmentResult.assignments.map(assignmentItemToRow));
        setSurveyorOptions(surveyorResult.surveyors);
      })
      .catch((error) => {
        if (active) setNotice({ message: error instanceof Error ? error.message : 'Assignment dari backend gagal dimuat.', severity: 'error' });
      })
      .finally(() => {
        if (active) setLoadingAssignments(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    api
      .provinces()
      .then((result) => {
        if (!active) return;
        setAssignmentLocationOptions((current) => ({ ...current, provinces: result.provinces }));
      })
      .catch(() => setAssignmentLocationOptions((current) => ({ ...current, provinces: [] })));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!assignmentForm.province) {
      setAssignmentLocationOptions((current) => ({ ...current, cities: [], districts: [], villages: [] }));
      return;
    }

    let active = true;
    api
      .cities(assignmentForm.province)
      .then((result) => {
        if (!active) return;
        setAssignmentLocationOptions((current) => ({ ...current, cities: result.cities, districts: [], villages: [] }));
        setAssignmentForm((current) => {
          const cityStillValid = result.cities.includes(current.city);
          return {
            ...current,
            city: cityStillValid ? current.city : '',
            district: cityStillValid ? current.district : '',
            village: cityStillValid ? current.village : '',
          };
        });
      })
      .catch(() => setAssignmentLocationOptions((current) => ({ ...current, cities: [], districts: [], villages: [] })));

    return () => {
      active = false;
    };
  }, [assignmentForm.province]);

  useEffect(() => {
    if (!assignmentForm.province || !assignmentForm.city) {
      setAssignmentLocationOptions((current) => ({ ...current, districts: [], villages: [] }));
      return;
    }

    let active = true;
    api
      .districts(assignmentForm.province, assignmentForm.city)
      .then((result) => {
        if (!active) return;
        setAssignmentLocationOptions((current) => ({ ...current, districts: result.districts, villages: [] }));
        setAssignmentForm((current) => {
          const districtStillValid = result.districts.includes(current.district);
          return {
            ...current,
            district: districtStillValid ? current.district : '',
            village: districtStillValid ? current.village : '',
          };
        });
      })
      .catch(() => setAssignmentLocationOptions((current) => ({ ...current, districts: [], villages: [] })));

    return () => {
      active = false;
    };
  }, [assignmentForm.province, assignmentForm.city]);

  useEffect(() => {
    if (!assignmentForm.province || !assignmentForm.city || !assignmentForm.district) {
      setAssignmentLocationOptions((current) => ({ ...current, villages: [] }));
      return;
    }

    let active = true;
    api
      .villages(assignmentForm.province, assignmentForm.city, assignmentForm.district)
      .then((result) => {
        if (!active) return;
        setAssignmentLocationOptions((current) => ({ ...current, villages: result.villages }));
        setAssignmentForm((current) => ({
          ...current,
          village: result.villages.includes(current.village) ? current.village : '',
        }));
      })
      .catch(() => setAssignmentLocationOptions((current) => ({ ...current, villages: [] })));

    return () => {
      active = false;
    };
  }, [assignmentForm.province, assignmentForm.city, assignmentForm.district]);

  useEffect(() => {
    if (!assignmentForm.province || !assignmentForm.city || !assignmentForm.district || !assignmentForm.village) {
      setAssignmentLocationValid(null);
      return;
    }

    let active = true;
    api
      .validateLocation({
        province: assignmentForm.province,
        city: assignmentForm.city,
        district: assignmentForm.district,
        village: assignmentForm.village,
      })
      .then((result) => {
        if (active) setAssignmentLocationValid(result.valid);
      })
      .catch(() => {
        if (active) setAssignmentLocationValid(false);
      });

    return () => {
      active = false;
    };
  }, [assignmentForm.province, assignmentForm.city, assignmentForm.district, assignmentForm.village]);

  const openAssignDialog = () => {
    setAssignmentForm(emptyAssignmentForm);
    setAssignmentLocationValid(null);
    setDialogMode('assign');
  };
  const openReassignDialog = (row: AssignmentRow) => {
    setAssignmentForm(row);
    setDialogMode('reassign');
  };
  const saveAssignment = () => {
    if (
      !assignmentForm.store.trim() ||
      !assignmentForm.addressDetail.trim() ||
      !assignmentForm.landmark.trim() ||
      !assignmentLocationValid ||
      !assignmentForm.surveyorId ||
      !assignmentForm.visitDate ||
      !assignmentForm.priority ||
      !assignmentForm.type ||
      assignmentCoordinateError
    )
      return;
    const payload: AssignmentPayload = {
      storeName: assignmentForm.store,
      province: assignmentForm.province,
      city: assignmentForm.city,
      district: assignmentForm.district,
      village: assignmentForm.village,
      addressDetail: assignmentForm.addressDetail,
      landmark: assignmentForm.landmark,
      latitude: assignmentForm.latitude,
      longitude: assignmentForm.longitude,
      assignedSurveyorId: assignmentForm.surveyorId,
      visitDate: assignmentForm.visitDate,
      priority: assignmentForm.priority,
      visitObjective: assignmentForm.type,
      status: assignmentForm.status ? assignmentStatusValue(assignmentForm.status) : undefined,
      notes: assignmentForm.notes,
    };

    const request =
      dialogMode === 'reassign' && assignmentForm.id
        ? api.reassignAssignment(assignmentForm.id, payload)
        : api.createAssignment(payload);

    request
      .then((result) => {
        const nextRow = assignmentItemToRow(result.assignment);
        setRows((currentRows) =>
          dialogMode === 'reassign' ? currentRows.map((row) => (row.id === nextRow.id ? nextRow : row)) : [nextRow, ...currentRows],
        );
        setNotice({
          message:
            dialogMode === 'reassign'
              ? `${nextRow.store} sudah di-reassign ke ${nextRow.surveyor}.`
              : `${nextRow.store} ditambahkan ke perencanaan kunjungan backend.`,
          severity: 'success',
        });
        setDialogMode(null);
      })
      .catch((error) => setNotice({ message: error instanceof Error ? error.message : 'Assignment gagal disimpan.', severity: 'error' }));
  };
  const submitTargetStoreImport = async (file: File) => {
    setImportSubmitting(true);
    try {
      const { fileToBase64 } = await import('./utils/xlsx');
      const dataBase64 = await fileToBase64(file);
      const response = await api.importXlsx(importTemplates['Target store import'].kind, { fileName: file.name, dataBase64 });
      const assignmentResult = await api.assignments();
      setRows(assignmentResult.assignments.map(assignmentItemToRow));
      setDialogMode(null);
      setNotice({
        message: `${file.name} diproses: ${response.result.created} assignment dibuat, ${response.result.skipped} dilewati, ${response.result.errors.length} error.`,
        severity: response.result.errors.length ? 'warning' : 'success',
      });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Import target store gagal diproses backend.', severity: 'error' });
    } finally {
      setImportSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper className="section-panel">
        <SectionTitle
          icon={<RouteRoundedIcon />}
          title="Visit Planning"
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<UploadFileRoundedIcon />} onClick={() => setDialogMode('import')}>
                Import
              </Button>
              <Button variant="contained" startIcon={<AddLocationAltRoundedIcon />} onClick={openAssignDialog}>
                Assign
              </Button>
            </Stack>
          }
        />
        <Box className="filter-grid">
          <TextField label="Visit date" type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField select label="City" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city === 'All' ? 'All cities' : city}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Manager" value={managerFilter} onChange={(event) => setManagerFilter(event.target.value)}>
            {managers.map((manager) => (
              <MenuItem key={manager} value={manager}>
                {manager === 'All' ? 'All managers' : manager}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Search store"
            placeholder="Nama toko atau kecamatan"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="section-panel wide">
          <SectionTitle icon={<AssignmentTurnedInRoundedIcon />} title="Coverage by Area" />
          {loadingAssignments ? <LinearProgress /> : <GroupedStoreList rows={filteredRows} onReassign={openReassignDialog} />}
        </Paper>

        <Paper className="section-panel">
          <SectionTitle icon={<MapRoundedIcon />} title="Area Capacity" />
          <Stack spacing={2}>
            {areaCapacity.map((item) => (
              <Stack key={item.city} spacing={0.7}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>{item.city}</Typography>
                  <Typography color="text.secondary">{item.count} stores</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={item.progress} />
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Box>

      <ImportXlsxDialog
        open={dialogMode === 'import'}
        templateKey="Target store import"
        onClose={() => setDialogMode(null)}
        onSubmit={submitTargetStoreImport}
        submitting={importSubmitting}
      />

      <Dialog open={dialogMode === 'assign' || dialogMode === 'reassign'} onClose={() => setDialogMode(null)} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === 'reassign' ? 'Reassign Store' : 'Assign Store'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              label="Store name"
              value={assignmentForm.store}
              onChange={(event) => setAssignmentForm((current) => ({ ...current, store: event.target.value }))}
              disabled={dialogMode === 'reassign'}
            />
            <TextField
              select
              label="Surveyor"
              value={assignmentForm.surveyorId}
              onChange={(event) => {
                const surveyor = surveyorOptions.find((item) => item.id === event.target.value);
                setAssignmentForm((current) => ({
                  ...current,
                  surveyorId: event.target.value,
                  surveyor: surveyor?.name ?? current.surveyor,
                }));
              }}
            >
              <MenuItem value="">
                <em>Pilih surveyor</em>
              </MenuItem>
              {surveyorOptions.map((surveyor) => (
                <MenuItem key={surveyor.id} value={surveyor.id}>
                  {surveyor.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Visit date" type="date" value={assignmentForm.visitDate} onChange={(event) => setAssignmentForm((current) => ({ ...current, visitDate: event.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField select label="Priority" value={assignmentForm.priority} onChange={(event) => setAssignmentForm((current) => ({ ...current, priority: event.target.value as AssignmentRow['priority'] }))}>
              <MenuItem value="">
                <em>Pilih priority</em>
              </MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </TextField>
            <TextField select label="Visit Objective" value={assignmentForm.type} onChange={(event) => setAssignmentForm((current) => ({ ...current, type: event.target.value }))}>
              <MenuItem value="">
                <em>Pilih visit objective</em>
              </MenuItem>
              <MenuItem value="Survey">Survey</MenuItem>
              <MenuItem value="Revisit">Revisit</MenuItem>
              <MenuItem value="Verify">Verify</MenuItem>
              <MenuItem value="Special lead">Special lead</MenuItem>
            </TextField>
            <Box className="address-grid">
              <TextField
                select
                label="Provinsi"
                value={assignmentForm.province}
                onChange={(event) =>
                  setAssignmentForm((current) => ({
                    ...current,
                    province: event.target.value,
                    city: '',
                    district: '',
                    village: '',
                  }))
                }
              >
                <MenuItem value="">
                  <em>Pilih provinsi</em>
                </MenuItem>
                {assignmentLocationOptions.provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Kota/Kabupaten"
                value={assignmentForm.city}
                disabled={!assignmentForm.province || !assignmentLocationOptions.cities.length}
                onChange={(event) =>
                  setAssignmentForm((current) => ({
                    ...current,
                    city: event.target.value,
                    district: '',
                    village: '',
                  }))
                }
              >
                <MenuItem value="">
                  <em>Pilih kota/kabupaten</em>
                </MenuItem>
                {assignmentLocationOptions.cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Kecamatan"
                value={assignmentForm.district}
                disabled={!assignmentForm.city || !assignmentLocationOptions.districts.length}
                onChange={(event) =>
                  setAssignmentForm((current) => ({
                    ...current,
                    district: event.target.value,
                    village: '',
                  }))
                }
              >
                <MenuItem value="">
                  <em>Pilih kecamatan</em>
                </MenuItem>
                {assignmentLocationOptions.districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Desa/Kelurahan"
                value={assignmentForm.village}
                disabled={!assignmentForm.district || !assignmentLocationOptions.villages.length}
                onChange={(event) => setAssignmentForm((current) => ({ ...current, village: event.target.value }))}
              >
                <MenuItem value="">
                  <em>Pilih desa/kelurahan</em>
                </MenuItem>
                {assignmentLocationOptions.villages.map((village) => (
                  <MenuItem key={village} value={village}>
                    {village}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              label="Address Detail"
              value={assignmentForm.addressDetail}
              onChange={(event) => setAssignmentForm((current) => ({ ...current, addressDetail: event.target.value }))}
              multiline
              minRows={2}
            />
            <TextField
              label="Landmark"
              value={assignmentForm.landmark}
              onChange={(event) => setAssignmentForm((current) => ({ ...current, landmark: event.target.value }))}
            />
            <Box className="address-grid">
              <TextField
                label="Latitude target (opsional)"
                value={assignmentForm.latitude}
                onChange={(event) => setAssignmentForm((current) => ({ ...current, latitude: event.target.value }))}
                error={Boolean(assignmentCoordinateError)}
              />
              <TextField
                label="Longitude target (opsional)"
                value={assignmentForm.longitude}
                onChange={(event) => setAssignmentForm((current) => ({ ...current, longitude: event.target.value }))}
                error={Boolean(assignmentCoordinateError)}
              />
            </Box>
            <Typography variant="caption" color={assignmentCoordinateError ? 'error' : 'text.secondary'}>
              {assignmentCoordinateError || 'Opsional. Jika diisi, jarak GPS surveyor dihitung dari titik target ini. Jika kosong, jarak otomatis 0m.'}
            </Typography>
            <Chip
              icon={assignmentLocationValid ? <VerifiedRoundedIcon /> : <WarningAmberRoundedIcon />}
              label={
                assignmentLocationValid === null
                  ? 'Pilih alamat lengkap dari master lokasi'
                  : assignmentLocationValid
                    ? 'Alamat target valid dari master lokasi Jawa'
                    : 'Kombinasi alamat tidak ditemukan di master lokasi'
              }
              color={assignmentLocationValid ? 'success' : assignmentLocationValid === false ? 'error' : 'default'}
              variant={assignmentLocationValid ? 'filled' : 'outlined'}
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogMode(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveAssignment}
            disabled={
              !assignmentForm.store.trim() ||
              !assignmentForm.addressDetail.trim() ||
              !assignmentForm.landmark.trim() ||
              !assignmentLocationValid ||
              !assignmentForm.surveyorId ||
              !assignmentForm.visitDate ||
              !assignmentForm.priority ||
              !assignmentForm.type ||
              Boolean(assignmentCoordinateError)
            }
          >
            {dialogMode === 'reassign' ? 'Save Reassign' : 'Assign Store'}
          </Button>
        </DialogActions>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function GroupedStoreList({ rows, onReassign }: { rows: AssignmentRow[]; onReassign: (row: AssignmentRow) => void }) {
  const language = useCurrentLanguage();
  const groupedAssignments = groupAssignmentRows(rows);
  const provinceEntries = Object.entries(groupedAssignments);
  const hierarchyKey = rows
    .map((row) => [row.province, row.city, row.district, row.village].join('/'))
    .sort()
    .join('|');
  const [expandedProvinces, setExpandedProvinces] = useState<Record<string, boolean>>({});
  const [expandedCities, setExpandedCities] = useState<Record<string, boolean>>({});
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});
  const [expandedVillages, setExpandedVillages] = useState<Record<string, boolean>>({});

  const cityKey = (province: string, city: string) => `${province}::${city}`;
  const districtKey = (province: string, city: string, district: string) => `${province}::${city}::${district}`;
  const villageKey = (province: string, city: string, district: string, village: string) => `${province}::${city}::${district}::${village}`;
  const countCityStores = (districts: Record<string, Record<string, AssignmentRow[]>>) =>
    Object.values(districts)
      .flatMap((villages) => Object.values(villages))
      .flat().length;
  const countDistrictStores = (villages: Record<string, AssignmentRow[]>) => Object.values(villages).flat().length;

  useEffect(() => {
    const firstProvince = provinceEntries[0];
    const firstCity = firstProvince ? Object.entries(firstProvince[1])[0] : undefined;
    const firstDistrict = firstProvince && firstCity ? Object.entries(firstCity[1])[0] : undefined;
    const firstVillage = firstProvince && firstCity && firstDistrict ? Object.entries(firstDistrict[1])[0] : undefined;

    setExpandedProvinces((current) => {
      const next = Object.fromEntries(provinceEntries.map(([province]) => [province, current[province] ?? false]));
      if (provinceEntries.length && !Object.values(next).some(Boolean)) {
        next[provinceEntries[0][0]] = true;
      }
      return next;
    });
    setExpandedCities((current) => {
      const cityEntries = provinceEntries.flatMap(([province, cities]) => Object.keys(cities).map((city) => cityKey(province, city)));
      const next = Object.fromEntries(cityEntries.map((key) => [key, current[key] ?? false]));
      if (firstProvince && firstCity && !Object.values(next).some(Boolean)) {
        next[cityKey(firstProvince[0], firstCity[0])] = true;
      }
      return next;
    });
    setExpandedDistricts((current) => {
      const districtEntries = provinceEntries.flatMap(([province, cities]) =>
        Object.entries(cities).flatMap(([city, districts]) => Object.keys(districts).map((district) => districtKey(province, city, district))),
      );
      const next = Object.fromEntries(districtEntries.map((key) => [key, current[key] ?? false]));
      if (firstProvince && firstCity && firstDistrict && !Object.values(next).some(Boolean)) {
        next[districtKey(firstProvince[0], firstCity[0], firstDistrict[0])] = true;
      }
      return next;
    });
    setExpandedVillages((current) => {
      const villageEntries = provinceEntries.flatMap(([province, cities]) =>
        Object.entries(cities).flatMap(([city, districts]) =>
          Object.entries(districts).flatMap(([district, villages]) => Object.keys(villages).map((village) => villageKey(province, city, district, village))),
        ),
      );
      const next = Object.fromEntries(villageEntries.map((key) => [key, current[key] ?? false]));
      if (firstProvince && firstCity && firstDistrict && firstVillage && !Object.values(next).some(Boolean)) {
        next[villageKey(firstProvince[0], firstCity[0], firstDistrict[0], firstVillage[0])] = true;
      }
      return next;
    });
  }, [hierarchyKey]);

  if (!rows.length) {
    return (
      <Paper className="area-group">
        <Typography fontWeight={900}>Tidak ada toko sesuai filter.</Typography>
        <Typography variant="body2" color="text.secondary">
          Ubah city, manager, atau pencarian untuk melihat assignment lain.
        </Typography>
      </Paper>
    );
  }

  const expandAll = () => {
    setExpandedProvinces(Object.fromEntries(provinceEntries.map(([province]) => [province, true])));
    setExpandedCities(
      Object.fromEntries(provinceEntries.flatMap(([province, cities]) => Object.keys(cities).map((city) => [cityKey(province, city), true]))),
    );
    setExpandedDistricts(
      Object.fromEntries(
        provinceEntries.flatMap(([province, cities]) =>
          Object.entries(cities).flatMap(([city, districts]) => Object.keys(districts).map((district) => [districtKey(province, city, district), true])),
        ),
      ),
    );
    setExpandedVillages(
      Object.fromEntries(
        provinceEntries.flatMap(([province, cities]) =>
          Object.entries(cities).flatMap(([city, districts]) =>
            Object.entries(districts).flatMap(([district, villages]) =>
              Object.keys(villages).map((village) => [villageKey(province, city, district, village), true]),
            ),
          ),
        ),
      ),
    );
  };

  const collapseAll = () => {
    setExpandedProvinces({});
    setExpandedCities({});
    setExpandedDistricts({});
    setExpandedVillages({});
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1.2} className="area-expand-toolbar">
        <Typography variant="body2" color="text.secondary">
          {rows.length} toko dikelompokkan per provinsi, kota, kecamatan, dan desa/kelurahan. Expand hanya area yang sedang dikerjakan.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={expandAll}>
            Expand all
          </Button>
          <Button size="small" variant="outlined" onClick={collapseAll}>
            Collapse all
          </Button>
        </Stack>
      </Stack>
      {provinceEntries.map(([province, cities]) => {
        const provinceCount = Object.values(cities)
          .flatMap((districts) => Object.values(districts))
          .flatMap((villages) => Object.values(villages))
          .flat().length;
        const expanded = Boolean(expandedProvinces[province]);

        return (
          <Paper key={province} className="area-group province-group">
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="area-heading">
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${province}`} onClick={() => setExpandedProvinces((current) => ({ ...current, [province]: !expanded }))}>
                  {expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                </IconButton>
                <PinDropRoundedIcon color="primary" />
                <Typography variant="h6">{province}</Typography>
              </Stack>
              <Chip label={`${provinceCount} stores`} color="primary" variant="outlined" />
            </Stack>

            {expanded && (
              <Stack spacing={1.2}>
                {Object.entries(cities).map(([city, districts]) => {
                  const currentCityKey = cityKey(province, city);
                  const cityExpanded = Boolean(expandedCities[currentCityKey]);
                  const cityCount = countCityStores(districts);

                  return (
                    <Box key={city} className="area-level city-level">
                      <Stack direction="row" justifyContent="space-between" alignItems="center" className="area-label area-node-heading">
                        <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                          <IconButton size="small" aria-label={`${cityExpanded ? 'Collapse' : 'Expand'} ${city}`} onClick={() => setExpandedCities((current) => ({ ...current, [currentCityKey]: !cityExpanded }))}>
                            {cityExpanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                          </IconButton>
                          <MapRoundedIcon fontSize="small" />
                          <Typography fontWeight={900}>{city}</Typography>
                        </Stack>
                        <Chip size="small" label={`${cityCount} toko`} />
                      </Stack>

                      {cityExpanded &&
                        Object.entries(districts).map(([district, villages]) => {
                          const currentDistrictKey = districtKey(province, city, district);
                          const districtExpanded = Boolean(expandedDistricts[currentDistrictKey]);
                          const districtCount = countDistrictStores(villages);

                          return (
                            <Box key={district} className="area-level district-level">
                              <Stack direction="row" justifyContent="space-between" alignItems="center" className="area-label area-node-heading">
                                <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                                  <IconButton
                                    size="small"
                                    aria-label={`${districtExpanded ? 'Collapse' : 'Expand'} ${district}`}
                                    onClick={() => setExpandedDistricts((current) => ({ ...current, [currentDistrictKey]: !districtExpanded }))}
                                  >
                                    {districtExpanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                                  </IconButton>
                                  <RouteRoundedIcon fontSize="small" />
                                  <Typography fontWeight={800}>{district}</Typography>
                                </Stack>
                                <Chip size="small" label={`${districtCount} toko`} />
                              </Stack>

                              {districtExpanded &&
                                Object.entries(villages).map(([village, stores]) => {
                                  const currentVillageKey = villageKey(province, city, district, village);
                                  const villageExpanded = Boolean(expandedVillages[currentVillageKey]);

                                  return (
                                    <Box key={village} className="area-level village-level">
                                      <Stack direction="row" justifyContent="space-between" alignItems="center" className="area-label area-node-heading">
                                        <Stack direction="row" spacing={1} alignItems="center" minWidth={0}>
                                          <IconButton
                                            size="small"
                                            aria-label={`${villageExpanded ? 'Collapse' : 'Expand'} ${village}`}
                                            onClick={() => setExpandedVillages((current) => ({ ...current, [currentVillageKey]: !villageExpanded }))}
                                          >
                                            {villageExpanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                                          </IconButton>
                                          <StorefrontRoundedIcon fontSize="small" />
                                          <Typography fontWeight={800}>{village}</Typography>
                                        </Stack>
                                        <Chip size="small" label={`${stores.length} toko`} />
                                      </Stack>

                                      {villageExpanded && (
                                        <>
                                          <Table size="small" className="grouped-store-table">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Store</TableCell>
                                                <TableCell>Surveyor</TableCell>
                                                <TableCell>Priority</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {stores.map((row) => (
                                                <TableRow key={row.id} hover>
                                                  <TableCell>
                            <Typography fontWeight={900} data-no-i18n>
                              {row.store}
                            </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                      {row.type}
                                                    </Typography>
                                                  </TableCell>
                                                  <TableCell>{row.surveyor}</TableCell>
                                                  <TableCell>
                                                    <Chip
                                                      size="small"
                                                      label={row.priority}
                                                      color={row.priority === 'High' ? 'warning' : 'default'}
                                                      variant={row.priority === 'High' ? 'filled' : 'outlined'}
                                                    />
                                                  </TableCell>
                                                  <TableCell>{assignmentStatusLabel(row.status)}</TableCell>
                                                  <TableCell align="right">
                                                    <Tooltip title={localCopy(language, { id: 'Ganti surveyor atau jadwal assignment toko ini.', en: 'Change the surveyor or schedule for this store assignment.', zh: '更改该门店任务的调研员或计划。' })}>
                                                      <IconButton aria-label={`Reassign ${row.store}`} onClick={() => onReassign(row)}>
                                                        <PublishedWithChangesRoundedIcon />
                                                      </IconButton>
                                                    </Tooltip>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                          <Stack spacing={1} className="assignment-card-list">
                                            {stores.map((row) => (
                                              <Paper key={row.id} className="assignment-store-card">
                                                <Stack spacing={1.2}>
                                                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                                                    <Box minWidth={0}>
                                                      <Typography fontWeight={900} data-no-i18n>
                                                        {row.store}
                                                      </Typography>
                                                      <Typography variant="caption" color="text.secondary">
                                                        {row.type} - {row.surveyor}
                                                      </Typography>
                                                    </Box>
                                                    <Chip
                                                      size="small"
                                                      label={row.priority}
                                                      color={row.priority === 'High' ? 'warning' : 'default'}
                                                      variant={row.priority === 'High' ? 'filled' : 'outlined'}
                                                    />
                                                  </Stack>
                                                  <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                                    <Chip size="small" label={assignmentStatusLabel(row.status)} variant="outlined" />
                                                    <Button size="small" variant="contained" startIcon={<PublishedWithChangesRoundedIcon />} onClick={() => onReassign(row)}>
                                                      Ganti Surveyor
                                                    </Button>
                                                  </Stack>
                                                </Stack>
                                              </Paper>
                                            ))}
                                          </Stack>
                                        </>
                                      )}
                                    </Box>
                                  );
                                })}
                            </Box>
                          );
                        })}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
}

function SurveyorPwaPage({
  view = 'list',
  onOpenSurvey,
  onBackToList,
}: {
  view?: 'list' | 'detail';
  onOpenSurvey?: () => void;
  onBackToList?: () => void;
}) {
  const language = useCurrentLanguage();
  const t = (text: string) => translateInline(text, language);
  const pwaText = (text: string) => {
    const copy: Record<string, SurveyHint> = {
      'Today Plan': { id: 'Rencana Hari Ini', en: 'Today Plan', zh: '\u4eca\u65e5\u8ba1\u5212' },
      'Assigned Visits': { id: 'Kunjungan Terjadwal', en: 'Assigned Visits', zh: '\u5df2\u5206\u914d\u62dc\u8bbf' },
      'Revision Queue': { id: 'Antrean Revisi', en: 'Revision Queue', zh: '\u4fee\u8ba2\u961f\u5217' },
      'Submitted Reports': { id: 'Laporan Terkirim', en: 'Submitted Reports', zh: '\u5df2\u63d0\u4ea4\u62a5\u544a' },
      Plan: { id: 'Kunjungan', en: 'Visits', zh: '\u62dc\u8bbf' },
      Draft: { id: 'Draft', en: 'Draft', zh: '\u8349\u7a3f' },
      History: { id: 'Riwayat', en: 'History', zh: '\u5386\u53f2' },
      'Add Unplanned Store': { id: 'Tambah Toko Unplanned', en: 'Add Unplanned Store', zh: '\u65b0\u589e\u8ba1\u5212\u5916\u95e8\u5e97' },
      'Add Manual Visit': { id: 'Tambah Kunjungan Manual', en: 'Add Manual Visit', zh: '\u65b0\u589e\u624b\u52a8\u62dc\u8bbf' },
      'Load Draft': { id: 'Muat Draft', en: 'Load Draft', zh: '\u52a0\u8f7d\u8349\u7a3f' },
      'Store revision notes': { id: 'Catatan revisi', en: 'Revision notes', zh: '\u4fee\u8ba2\u8bf4\u660e' },
      Survey: { id: 'Survei', en: 'Survey', zh: '\u8c03\u7814' },
      Report: { id: 'Laporan', en: 'Report', zh: '\u62a5\u544a' },
      'Open Revision': { id: 'Buka Revisi', en: 'Open Revision', zh: '\u6253\u5f00\u4fee\u8ba2' },
      'Continue Revision': { id: 'Lanjutkan Revisi', en: 'Continue Revision', zh: '\u7ee7\u7eed\u4fee\u8ba2' },
      'View Detail': { id: 'Lihat Detail', en: 'View Detail', zh: '\u67e5\u770b\u8be6\u60c5' },
      'View Report': { id: 'Lihat Laporan', en: 'View Report', zh: '\u67e5\u770b\u62a5\u544a' },
      'Merchant score': { id: 'Skor merchant', en: 'Merchant score', zh: '\u5546\u6237\u5f97\u5206' },
      'Data quality': { id: 'Kualitas data', en: 'Data quality', zh: '\u6570\u636e\u8d28\u91cf' },
      'Cooling survey form': { id: 'Form survei cooling', en: 'Cooling survey form', zh: '\u51b7\u5374\u4ef6\u8c03\u7814\u8868' },
      'Back to Today Plan': { id: 'Kembali ke Rencana Hari Ini', en: 'Back to Today Plan', zh: '\u8fd4\u56de\u4eca\u65e5\u8ba1\u5212' },
      'Back to Assigned Visits': { id: 'Kembali ke Kunjungan Terjadwal', en: 'Back to Assigned Visits', zh: '\u8fd4\u56de\u5df2\u5206\u914d\u62dc\u8bbf' },
      Start: { id: 'Mulai', en: 'Start', zh: '\u5f00\u59cb' },
      Address: { id: 'Alamat', en: 'Address', zh: '\u5730\u5740' },
      Contact: { id: 'Kontak', en: 'Contact', zh: '\u8054\u7cfb\u4eba' },
      Business: { id: 'Bisnis', en: 'Business', zh: '\u4e1a\u52a1' },
      Cooling: { id: 'Cooling', en: 'Cooling', zh: '\u51b7\u5374\u4ef6' },
      Supplier: { id: 'Supplier', en: 'Supplier', zh: '\u4f9b\u5e94\u5546' },
      Commercial: { id: 'Komersial', en: 'Commercial', zh: '\u5546\u52a1' },
      Open: { id: 'Keterbukaan', en: 'Openness', zh: '\u5408\u4f5c\u610f\u5411' },
      Step: { id: 'Langkah', en: 'Step', zh: '\u6b65\u9aa4' },
      Back: { id: 'Kembali', en: 'Back', zh: '\u8fd4\u56de' },
      Next: { id: 'Lanjut', en: 'Next', zh: '\u4e0b\u4e00\u6b65' },
      'Submit Survey': { id: 'Submit Survei', en: 'Submit Survey', zh: '\u63d0\u4ea4\u8c03\u7814' },
      'Submitting...': { id: 'Mengirim...', en: 'Submitting...', zh: '\u6b63\u5728\u63d0\u4ea4...' },
      'Score After Submit': { id: 'Skor Setelah Submit', en: 'Score After Submit', zh: '\u63d0\u4ea4\u540e\u8bc4\u5206' },
      'Submission Result': { id: 'Hasil Pengiriman', en: 'Submission Result', zh: '\u63d0\u4ea4\u7ed3\u679c' },
      'Merchant Potential': { id: 'Potensi Merchant', en: 'Merchant Potential', zh: '\u5546\u6237\u6f5c\u529b' },
      'Data Quality': { id: 'Kualitas Data', en: 'Data Quality', zh: '\u6570\u636e\u8d28\u91cf' },
      'Lead Type': { id: 'Tipe Lead', en: 'Lead Type', zh: '\u7ebf\u7d22\u7c7b\u578b' },
      'Choose a store to start the survey': { id: 'Pilih toko untuk mulai survei', en: 'Choose a store to start the survey', zh: '\u9009\u62e9\u95e8\u5e97\u5f00\u59cb\u8c03\u7814' },
      'Choose an assigned visit to start': { id: 'Pilih kunjungan terjadwal untuk mulai', en: 'Choose an assigned visit to start', zh: '\u9009\u62e9\u5df2\u5206\u914d\u62dc\u8bbf\u5f00\u59cb' },
      'Tap a store name in Today Plan': { id: 'Tap nama toko di Rencana Hari Ini', en: 'Tap a store name in Today Plan', zh: '\u70b9\u51fb\u4eca\u65e5\u8ba1\u5212\u4e2d\u7684\u95e8\u5e97\u540d\u79f0' },
      'Select a visit from the list': { id: 'Pilih kunjungan dari daftar', en: 'Select a visit from the list', zh: '\u4ece\u5217\u8868\u4e2d\u9009\u62e9\u62dc\u8bbf' },
      'Add Store': { id: 'Tambah Toko', en: 'Add Store', zh: '\u6dfb\u52a0\u95e8\u5e97' },
      Cancel: { id: 'Batal', en: 'Cancel', zh: '\u53d6\u6d88' },
      'Store name': { id: 'Nama toko', en: 'Store name', zh: '\u95e8\u5e97\u540d\u79f0' },
      'In Progress': { id: 'Sedang berjalan', en: 'In Progress', zh: '\u8fdb\u884c\u4e2d' },
      Revisit: { id: 'Kunjungan ulang', en: 'Revisit', zh: '\u590d\u8bbf' },
      'Visit & Location': { id: 'Kunjungan & Lokasi', en: 'Visit & Location', zh: '\u8bbf\u95ee\u548c\u4f4d\u7f6e' },
    };
    return copy[text]?.[language] ?? t(text);
  };
  const theme = useTheme();
  const isMobileLayout = useMediaQuery(theme.breakpoints.down('md'));
  const listSliderRef = useRef<HTMLDivElement | null>(null);
  const slideTouchStartX = useRef<number | null>(null);
  const slideTouchStartY = useRef<number | null>(null);
  const slideWheelLocked = useRef(false);
  const slideScrollSettleTimer = useRef<number | null>(null);
  const slideProgrammaticTarget = useRef<number | null>(null);
  const slideProgrammaticClearTimer = useRef<number | null>(null);
  const previousSurveyorView = useRef(view);
  const submitInFlightRef = useRef(false);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState(0);
  const [planItems, setPlanItems] = useState<PlanItem[]>(() => (cachedSurveyorPlanItems.length ? cachedSurveyorPlanItems : todayPlan));
  const [storeName, setStoreName] = useState('');
  const [surveyForm, setSurveyForm] = useState<SurveyFormState>(defaultSurveyForm);
  const [draftSavedAt, setDraftSavedAt] = useState('');
  const [unplannedOpen, setUnplannedOpen] = useState(false);
  const [unplannedName, setUnplannedName] = useState('');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedStore, setLastSubmittedStore] = useState('');
  const [submittedScore, setSubmittedScore] = useState<SurveySubmitResult | null>(null);
  const [historyItems, setHistoryItems] = useState<SurveyHistoryItem[]>(() => cachedSurveyorHistoryItems);
  const [revisionSourceId, setRevisionSourceId] = useState('');
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [locationOptions, setLocationOptions] = useState({
    provinces: [] as string[],
    cities: [] as string[],
    districts: [] as string[],
    villages: [] as string[],
  });
  const [address, setAddress] = useState({
    province: '',
    city: '',
    district: '',
    village: '',
  });
  const [locationValid, setLocationValid] = useState<boolean | null>(null);

  const updateSurveyForm = <K extends keyof SurveyFormState>(key: K, value: SurveyFormState[K]) => {
    setSurveyForm((current) => ({ ...current, [key]: value }));
  };

  const selectedPlanItem = planItems.find((item) => item.name === storeName);
  const evidenceMissingReason = [surveyForm.interiorPhotoMissingReason, surveyForm.picPhotoMissingReason].filter(Boolean).join(' | ');
  const coolingBrands = surveyForm.otherCoolingBrand.trim()
    ? [...surveyForm.coolingBrands, surveyForm.otherCoolingBrand.trim()]
    : surveyForm.coolingBrands;
  const revisionItems = useMemo(
    () =>
      historyItems
        .filter((row) => {
          if (row.verificationStatus !== 'NEED_REVISION') return false;
          const rowTime = surveyTimestamp(row.submitTime);
          return !historyItems.some((candidate) => candidate.id !== row.id && candidate.storeName === row.storeName && surveyTimestamp(candidate.submitTime) > rowTime);
        })
        .sort((left, right) => surveyTimestamp(right.submitTime) - surveyTimestamp(left.submitTime)),
    [historyItems],
  );
  const visibleHistoryItems = useMemo(() => historyItems.slice(0, 60), [historyItems]);
  const historyDateGroups = useMemo(() => groupSurveyHistoryByDateAndStatus(visibleHistoryItems, language), [visibleHistoryItems, language]);
  const selectedExistingSubmission = useMemo(() => {
    if (!storeName.trim()) return undefined;
    const assignmentId = selectedPlanItem?.assignmentId;
    return historyItems.find((row) => (assignmentId ? row.assignmentId === assignmentId : row.storeName === storeName));
  }, [historyItems, selectedPlanItem?.assignmentId, storeName]);
  const selectedStoreSubmitLocked = Boolean(
    selectedExistingSubmission &&
      selectedExistingSubmission.id !== revisionSourceId &&
      selectedExistingSubmission.verificationStatus !== 'NEED_REVISION',
  );
  const visitCompleted = isCompletedVisit(surveyForm.visitOutcome);
  const visitException = Boolean(surveyForm.visitOutcome && !visitCompleted);
  const showFullSurveyFlow = !surveyForm.visitOutcome || visitCompleted;
  const activeSurveySteps = showFullSurveyFlow ? fullSurveySteps : exceptionSurveySteps;
  const reviewStepIndex = activeSurveySteps.length - 1;
  const submittedVisitIncomplete = submittedScore?.leadClassification === 'Visit Not Completed';

  useEffect(() => {
    setStep((current) => Math.min(current, reviewStepIndex));
  }, [reviewStepIndex]);

  const clampMobileSlide = (index: number) => Math.max(0, Math.min(surveyorListSlideLabels.length - 1, index));

  const goToMobileSlide = (index: number) => {
    setMobileSlideIndex(clampMobileSlide(index));
  };

  const getListSlideStep = () => {
    const slider = listSliderRef.current;
    if (!slider) return 0;
    const computed = window.getComputedStyle(slider);
    const gap = Number.parseFloat(computed.columnGap || computed.gap || '0') || 0;
    const slide = slider.querySelector<HTMLElement>('.surveyor-list-slide');
    return (slide?.getBoundingClientRect().width || slider.clientWidth) + gap;
  };

  const handleListSlideTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobileLayout) return;
    const touch = event.touches[0];
    slideTouchStartX.current = touch.clientX;
    slideTouchStartY.current = touch.clientY;
  };

  const handleListSlideTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!isMobileLayout || slideTouchStartX.current === null || slideTouchStartY.current === null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - slideTouchStartX.current;
    const deltaY = touch.clientY - slideTouchStartY.current;
    slideTouchStartX.current = null;
    slideTouchStartY.current = null;
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    setMobileSlideIndex((current) => clampMobileSlide(current + (deltaX > 0 ? 1 : -1)));
  };

  const handleListSlideWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!isMobileLayout) return;
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.6 ? event.deltaX : 0;
    const shiftedDelta = event.shiftKey && Math.abs(event.deltaY) > 16 ? event.deltaY : 0;
    const delta = horizontalDelta || shiftedDelta;
    if (Math.abs(delta) < 18) return;
    event.preventDefault();
    if (slideWheelLocked.current) return;
    slideWheelLocked.current = true;
    window.setTimeout(() => {
      slideWheelLocked.current = false;
    }, 420);
    setMobileSlideIndex((current) => clampMobileSlide(current + (delta > 0 ? 1 : -1)));
  };

  const handleListSlideScroll = () => {
    if (!isMobileLayout) return;
    const slider = listSliderRef.current;
    const slideStep = getListSlideStep();
    if (!slider || !slideStep) return;
    if (slideScrollSettleTimer.current) window.clearTimeout(slideScrollSettleTimer.current);
    if (slideProgrammaticTarget.current !== null) {
      const targetLeft = slideProgrammaticTarget.current * slideStep;
      const targetTolerance = Math.max(3, slideStep * 0.08);
      if (Math.abs(slider.scrollLeft - targetLeft) > targetTolerance) return;
      slideProgrammaticTarget.current = null;
      if (slideProgrammaticClearTimer.current) {
        window.clearTimeout(slideProgrammaticClearTimer.current);
        slideProgrammaticClearTimer.current = null;
      }
    }
    slideScrollSettleTimer.current = window.setTimeout(() => {
      const nextIndex = clampMobileSlide(Math.round(slider.scrollLeft / slideStep));
      setMobileSlideIndex((current) => (current === nextIndex ? current : nextIndex));
      slideScrollSettleTimer.current = null;
    }, 90);
  };

  const blockingErrors = useMemo(() => {
    const errors: string[] = [];
    if (!storeName.trim()) errors.push('Pilih kunjungan dari daftar terjadwal terlebih dahulu.');
    if (selectedStoreSubmitLocked) errors.push('Survey toko ini sudah tersubmit. Submit ulang hanya bisa dilakukan jika verifikator menandai Need Revision.');
    if (!surveyForm.plannedOrUnplanned) errors.push('Tipe kunjungan wajib terisi dari toko yang dipilih.');
    if (!locationValid) errors.push('Alamat harus valid dari master lokasi Jawa.');
    if (!surveyForm.latitude || !surveyForm.longitude) errors.push('GPS wajib dicapture.');
    if (!surveyForm.visitOutcome) errors.push('Hasil kunjungan wajib dipilih.');

    if (!surveyForm.visitOutcome) return errors;

    if (!visitCompleted) {
      if (!surveyForm.surveyorNotes.trim()) errors.push('Catatan alasan/kondisi wajib diisi untuk kunjungan tidak selesai.');
      return errors;
    }

    if (!surveyForm.addressDetail.trim()) errors.push('Alamat detail wajib diisi.');
    if (!surveyForm.landmark.trim()) errors.push('Landmark/patokan wajib diisi.');
    if (!surveyForm.picType) errors.push('Tipe PIC wajib dipilih.');
    if (!surveyForm.whatsappNumber.trim() && !surveyForm.waEmptyReason) errors.push('Jika WA kosong, alasan wajib dipilih.');
    if (!surveyForm.purchasingDecisionMaker) errors.push('Pengambil keputusan pembelian wajib dipilih.');
    if (!surveyForm.decisionMakerAvailability) errors.push('Ketersediaan decision maker wajib dipilih.');
    if (!surveyForm.businessType) errors.push('Tipe bisnis wajib dipilih.');
    if (!surveyForm.coolingProducts.length) errors.push('Minimal pilih satu produk cooling.');
    if (!surveyForm.vehicleSpecialization.length) errors.push('Minimal pilih satu spesialisasi kendaraan.');
    if (!surveyForm.storeScale) errors.push('Skala toko wajib dipilih.');
    if (!surveyForm.coolingShelfSize) errors.push('Ukuran rak cooling wajib dipilih.');
    if (!surveyForm.coolingSalesActivity) errors.push('Aktivitas penjualan cooling wajib dipilih.');
    if (!coolingBrands.length) errors.push('Minimal pilih satu brand cooling atau isi brand manual.');
    if (!surveyForm.productSellingSegment) errors.push('Segmen produk wajib dipilih.');
    if (!surveyForm.lowCostImportShare) errors.push('Share import low cost wajib dipilih.');
    if (!surveyForm.supplierType.length) errors.push('Minimal pilih satu tipe supplier.');
    if (!surveyForm.supplierDependency) errors.push('Ketergantungan supplier wajib dipilih.');
    if (!surveyForm.supplierSatisfaction) errors.push('Kepuasan supplier wajib dipilih.');
    if (!surveyForm.returnEase) errors.push('Kemudahan retur wajib dipilih.');
    if (!surveyForm.deliverySpeed) errors.push('Kecepatan delivery wajib dipilih.');
    if (!surveyForm.restockFrequency) errors.push('Frekuensi restock wajib dipilih.');
    if (!surveyForm.purchaseSizeRange) errors.push('Skala pembelian wajib dipilih.');
    if (!surveyForm.monthlyPurchaseValue) errors.push('Estimasi nilai pembelian bulanan wajib dipilih.');
    if (!surveyForm.paymentMethod) errors.push('Metode pembayaran wajib dipilih.');
    if (!surveyForm.marginExpectation) errors.push('Ekspektasi margin wajib dipilih.');
    if (!surveyForm.currentOrderMethod.length) errors.push('Minimal pilih satu metode order saat ini.');
    if (!surveyForm.mainPurchaseDriver.length) errors.push('Minimal pilih satu purchase driver.');
    if (!surveyForm.priceSensitivity) errors.push('Sensitivitas harga wajib dipilih.');
    if (!surveyForm.opennessToNewSupplier) errors.push('Keterbukaan supplier baru wajib dipilih.');
    if (!surveyForm.reasonToTryNewSupplier.length) errors.push('Minimal pilih satu alasan mencoba supplier baru.');
    if (!surveyForm.willingnessToReceiveFollowUp) errors.push('Izin follow-up wajib dipilih.');
    if (surveyForm.visitOutcome === 'Survey Completed' && !surveyForm.storefrontPhotoUrl) {
      errors.push('Foto tampak depan wajib untuk Survey Completed.');
    }
    if (surveyForm.visitOutcome === 'Survey Completed' && !surveyForm.interiorPhotoUrl && !surveyForm.interiorPhotoMissingReason) {
      errors.push('Jika foto dalam/rak kosong, pilih alasan refusal.');
    }
    if (surveyForm.visitOutcome === 'Survey Completed' && !surveyForm.picPhotoUrl && !surveyForm.picPhotoMissingReason) {
      errors.push('Jika foto PIC kosong, pilih alasan refusal.');
    }
    return errors;
  }, [locationValid, selectedStoreSubmitLocked, storeName, surveyForm, visitCompleted]);

  const warningMessages = useMemo(() => {
    const warnings: string[] = [];
    if (surveyForm.gpsWarningFlag || surveyForm.gpsDistanceFromTarget > 100) warnings.push('GPS warning: jarak submit lebih dari 100 meter dari target.');
    if (visitException) {
      warnings.push('Kunjungan tidak selesai: pertanyaan bisnis, supplier, commercial, dan foto PIC tidak diwajibkan.');
      return warnings;
    }
    if (!surveyForm.whatsappNumber.trim()) warnings.push('WA kosong: toko tidak bisa menjadi Hot Lead, tetapi masih bisa Qualified Lead.');
    if (!surveyForm.interiorPhotoUrl) warnings.push('Foto dalam/rak kosong: akan masuk queue warning verificator.');
    if (!surveyForm.picPhotoUrl) warnings.push('Foto dengan PIC kosong: perlu alasan agar submit tetap boleh.');
    const unknownCount = [
      surveyForm.returnEase,
      surveyForm.deliverySpeed,
      surveyForm.restockFrequency,
      surveyForm.purchaseSizeRange,
      surveyForm.monthlyPurchaseValue,
      surveyForm.paymentMethod,
    ].filter((value) => value.includes('Tidak tahu') || value.includes('Tidak bersedia')).length;
    if (unknownCount >= 2) warnings.push('Banyak jawaban tidak tahu/tidak bersedia: Data Quality Score bisa turun.');
    return warnings;
  }, [surveyForm, visitException]);

  const selectStoreForSurvey = (name: string) => {
    const item = planItems.find((planItem) => planItem.name === name);
    setStoreName(name);
    setSurveyForm({
      ...defaultSurveyForm,
      plannedOrUnplanned: item?.tag.toLowerCase().includes('unplanned') ? 'UNPLANNED' : 'PLANNED',
      addressDetail: item?.addressDetail ?? '',
      landmark: item?.landmark ?? '',
    });
    if (item) {
      setAddress({
        province: item.province,
        city: item.city,
        district: item.district,
        village: item.village,
      });
      setLocationValid(true);
    }
    setStep(0);
    setTab(0);
    setSubmittedScore(null);
    setRevisionSourceId('');
    setNotice({ message: `${name} dipilih. Form survey lengkap siap diisi.`, severity: 'info' });
    onOpenSurvey?.();
  };

  const openSurveyFromHistory = (row: SurveyHistoryItem, mode: 'revision' | 'detail') => {
    setStoreName(row.storeName);
    setSurveyForm(surveyHistoryToForm(row));
    setAddress({
      province: row.province,
      city: row.city,
      district: row.district,
      village: row.village,
    });
    setLocationValid(true);
    setStep(mode === 'revision' ? 0 : (isCompletedVisit(row.visitOutcome) ? fullSurveySteps : exceptionSurveySteps).length - 1);
    setTab(0);
    setSubmittedScore(row);
    setRevisionSourceId(mode === 'revision' ? row.id : '');
    setNotice({ message: `${row.storeName} ${mode === 'revision' ? 'Dibuka untuk revisi.' : 'Detail survey dibuka.'}`, severity: 'info' });
    onOpenSurvey?.();
  };

  const addUnplannedStore = () => {
    const nextStoreName = unplannedName.trim();
    if (!nextStoreName) return;
    setPlanItems((current) => {
      const next = [
        ...current,
        {
          assignmentId: '',
          name: nextStoreName,
          area: address.district || 'Unplanned Area',
          status: 'Draft',
          tag: 'Unplanned store',
          province: address.province,
          city: address.city,
          district: address.district,
          village: address.village,
          addressDetail: surveyForm.addressDetail,
          landmark: surveyForm.landmark,
          latitude: '',
          longitude: '',
        },
      ];
      cachedSurveyorPlanItems = next;
      return next;
    });
    setTab(0);
    setUnplannedName('');
    setUnplannedOpen(false);
    setNotice({ message: `${nextStoreName} ditambahkan ke list. Klik nama toko untuk membuka form survey.`, severity: 'success' });
  };

  const captureGps = () => {
    const applyPosition = async (latitude: number, longitude: number, accuracy = 12) => {
      const roundedAccuracy = Math.round(accuracy);
      const distance = distanceMetersBetween(latitude, longitude, selectedPlanItem?.latitude, selectedPlanItem?.longitude);
      setSurveyForm((current) => ({
        ...current,
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        gpsAccuracy: roundedAccuracy,
        gpsDistanceFromTarget: distance,
        gpsWarningFlag: distance > 100,
      }));

      try {
        const reverse = await api.reverseLocation(latitude, longitude, roundedAccuracy);
        if (reverse.match) {
          const nextAddress = {
            province: reverse.match.province,
            city: reverse.match.city,
            district: reverse.match.district,
            village: reverse.match.village,
          };
          setLocationOptions((current) => ({
            provinces: includeOption(current.provinces, nextAddress.province),
            cities: includeOption(current.cities, nextAddress.city),
            districts: includeOption(current.districts, nextAddress.district),
            villages: includeOption(current.villages, nextAddress.village),
          }));
          setAddress(nextAddress);
          setLocationValid(true);
          setNotice({
            message: `GPS berhasil dicapture. Lokasi otomatis: ${nextAddress.village}, ${nextAddress.district}, ${nextAddress.city}.`,
            severity: 'success',
          });
          return;
        }

        setNotice({
          message: reverse.available
            ? 'GPS berhasil dicapture, tetapi titik tidak ditemukan dalam boundary desa/kelurahan. Pilih lokasi manual.'
            : 'GPS berhasil dicapture. Data boundary lokasi belum tersedia, pilih lokasi manual.',
          severity: reverse.available ? 'warning' : 'info',
        });
      } catch {
        setNotice({ message: 'GPS berhasil dicapture, tetapi lokasi otomatis gagal dibaca. Pilih lokasi manual.', severity: 'warning' });
      }
    };

    if (!navigator.geolocation) {
      setNotice({ message: 'GPS perangkat tidak tersedia. Aktifkan layanan lokasi perangkat lalu coba lagi.', severity: 'error' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyPosition(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
      },
      () => setNotice({ message: 'GPS tidak bisa dicapture. Izinkan akses lokasi dan pastikan sinyal GPS perangkat aktif.', severity: 'error' }),
      { enableHighAccuracy: true, timeout: 6000 },
    );
  };

  const saveDraft = () => {
    if (!storeName.trim()) {
      setNotice({ message: 'Pilih toko dari list terlebih dahulu sebelum menyimpan draft.', severity: 'warning' });
      return;
    }
    const savedAt = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const draftSaved = safeWriteLocalJson(surveyDraftStorageKey, { storeName, surveyForm, address, step, savedAt });
    if (!draftSaved) {
      setNotice({ message: 'Draft lokal tidak bisa disimpan. Kosongkan storage browser atau submit setelah koneksi stabil.', severity: 'error' });
      return;
    }
    setDraftSavedAt(savedAt);
    setNotice({ message: `Draft ${storeName} tersimpan lokal pada ${savedAt}.`, severity: 'success' });
  };

  const loadDraft = () => {
    const rawDraft = localStorage.getItem(surveyDraftStorageKey);
    if (!rawDraft) {
      setNotice({ message: 'Belum ada draft lokal untuk dimuat.', severity: 'info' });
      return;
    }
    try {
      const draft = JSON.parse(rawDraft) as {
        storeName: string;
        surveyForm: SurveyFormState;
        address: typeof address;
        step: number;
        savedAt: string;
      };
      setStoreName(draft.storeName);
      setSurveyForm({ ...defaultSurveyForm, ...draft.surveyForm });
      setAddress(draft.address);
      setStep(draft.step);
      setDraftSavedAt(draft.savedAt);
      setTab(0);
      setRevisionSourceId('');
      setNotice({ message: `Draft ${draft.storeName} berhasil dimuat.`, severity: 'success' });
      onOpenSurvey?.();
    } catch {
      setNotice({ message: 'Draft lokal tidak bisa dibaca.', severity: 'error' });
    }
  };

  const buildSurveyPayload = () => {
    const notCollected = surveyForm.visitOutcome ? `${incompleteSurveyPlaceholder}: ${surveyForm.visitOutcome}` : incompleteSurveyPlaceholder;
    const notCollectedList = [notCollected];
    const completedPayload = visitCompleted;

    return {
      assignmentId: selectedPlanItem?.assignmentId || undefined,
      storeName,
      storeAlias: surveyForm.storeAlias,
      visitOutcome: surveyForm.visitOutcome,
      plannedOrUnplanned: surveyForm.plannedOrUnplanned as 'PLANNED' | 'UNPLANNED',
      ...address,
      addressDetail: completedPayload ? surveyForm.addressDetail : surveyForm.addressDetail.trim() || notCollected,
      landmark: completedPayload ? surveyForm.landmark : surveyForm.landmark.trim() || notCollected,
      latitude: surveyForm.latitude,
      longitude: surveyForm.longitude,
      gpsAccuracy: surveyForm.gpsAccuracy,
      gpsWarningFlag: surveyForm.gpsWarningFlag || surveyForm.gpsDistanceFromTarget > 100,
      gpsDistanceFromTarget: surveyForm.gpsDistanceFromTarget,
      contactPersonName: completedPayload ? surveyForm.contactPersonName : '',
      picType: completedPayload ? surveyForm.picType : 'Tidak ada narasumber',
      whatsappNumber: completedPayload ? surveyForm.whatsappNumber : '',
      waEmptyReason: completedPayload ? surveyForm.waEmptyReason : `Visit outcome: ${surveyForm.visitOutcome}`,
      purchasingDecisionMaker: completedPayload ? surveyForm.purchasingDecisionMaker : notCollected,
      decisionMakerAvailability: completedPayload ? surveyForm.decisionMakerAvailability : notCollected,
      businessType: completedPayload ? surveyForm.businessType : notCollected,
      vehicleSpecialization: completedPayload ? surveyForm.vehicleSpecialization : notCollectedList,
      storeScale: completedPayload ? surveyForm.storeScale : notCollected,
      coolingProducts: completedPayload ? surveyForm.coolingProducts : notCollectedList,
      coolingShelfSize: completedPayload ? surveyForm.coolingShelfSize : notCollected,
      coolingSalesActivity: completedPayload ? surveyForm.coolingSalesActivity : notCollected,
      coolingBrands: completedPayload ? coolingBrands : notCollectedList,
      productSellingSegment: completedPayload ? surveyForm.productSellingSegment : notCollected,
      lowCostImportShare: completedPayload ? surveyForm.lowCostImportShare : notCollected,
      supplierType: completedPayload ? surveyForm.supplierType : notCollectedList,
      supplierName: completedPayload ? surveyForm.supplierName : '',
      supplierDependency: completedPayload ? surveyForm.supplierDependency : notCollected,
      supplierSatisfaction: completedPayload ? surveyForm.supplierSatisfaction : notCollected,
      returnEase: completedPayload ? surveyForm.returnEase : notCollected,
      deliverySpeed: completedPayload ? surveyForm.deliverySpeed : notCollected,
      paymentMethod: completedPayload ? surveyForm.paymentMethod : notCollected,
      restockFrequency: completedPayload ? surveyForm.restockFrequency : notCollected,
      purchaseSizeRange: completedPayload ? surveyForm.purchaseSizeRange : notCollected,
      monthlyPurchaseValue: completedPayload ? surveyForm.monthlyPurchaseValue : notCollected,
      marginExpectation: completedPayload ? surveyForm.marginExpectation : notCollected,
      currentOrderMethod: completedPayload ? surveyForm.currentOrderMethod : notCollectedList,
      mainPurchaseDriver: completedPayload ? surveyForm.mainPurchaseDriver : notCollectedList,
      priceSensitivity: completedPayload ? surveyForm.priceSensitivity : notCollected,
      opennessToNewSupplier: completedPayload ? surveyForm.opennessToNewSupplier : notCollected,
      reasonToTryNewSupplier: completedPayload ? surveyForm.reasonToTryNewSupplier : notCollectedList,
      willingnessToReceiveFollowUp: completedPayload ? surveyForm.willingnessToReceiveFollowUp : notCollected,
      storefrontPhotoUrl: surveyForm.storefrontPhotoUrl,
      interiorPhotoUrl: completedPayload ? surveyForm.interiorPhotoUrl : '',
      picPhotoUrl: completedPayload ? surveyForm.picPhotoUrl : '',
      photoMissingReason: completedPayload ? evidenceMissingReason : `Visit outcome: ${surveyForm.visitOutcome}`,
      surveyorNotes: surveyForm.surveyorNotes.trim() || (completedPayload ? '' : `Visit outcome: ${surveyForm.visitOutcome}`),
    };
  };

  const submitSurvey = async () => {
    if (submitInFlightRef.current) return;
    if (selectedStoreSubmitLocked) {
      setNotice({ message: 'Survey toko ini sudah tersubmit. Buka revisi jika verifikator meminta perbaikan.', severity: 'warning' });
      return;
    }
    if (blockingErrors.length) {
      setStep(reviewStepIndex);
      setNotice({ message: 'Lengkapi field wajib sebelum submit survey.', severity: 'warning' });
      return;
    }

    submitInFlightRef.current = true;
    setSubmitting(true);
    try {
      const result = await api.submitSurvey(buildSurveyPayload());
      setSubmittedScore(result.survey);
      setHistoryItems((current) => {
        const next = [result.survey, ...current.filter((item) => item.id !== result.survey.id && item.id !== revisionSourceId)];
        cachedSurveyorHistoryItems = next;
        return next;
      });
      setLastSubmittedStore(storeName);
      setPlanItems((current) => {
        const next = current.map((item) => (item.name === storeName ? { ...item, status: 'Submitted' } : item));
        cachedSurveyorPlanItems = next;
        return next;
      });
      setSubmitOpen(true);
      setRevisionSourceId('');
      setNotice({ message: `Survey ${storeName} masuk queue verifikasi.`, severity: 'success' });
      localStorage.removeItem(surveyDraftStorageKey);
    } catch (error) {
      const draftSaved = safeWriteLocalJson(surveyDraftStorageKey, { storeName, surveyForm, address, step, savedAt: 'offline queue' });
      setNotice({
        message:
          error instanceof Error
            ? `Submit gagal: ${error.message}${draftSaved ? '' : ' Draft lokal juga gagal disimpan.'}`
            : draftSaved
              ? 'Submit gagal. Draft disimpan lokal.'
              : 'Submit gagal dan draft lokal tidak bisa disimpan.',
        severity: 'error',
      });
    } finally {
      submitInFlightRef.current = false;
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .provinces()
      .then((result) => {
        if (active) setLocationOptions((current) => ({ ...current, provinces: result.provinces }));
      })
      .catch(() => undefined);
    api.assignments({ visitDate: currentCampaignDateKey, limit: 100 })
      .then((result) => {
        if (!active) return;
        const assignments = result.assignments
          .filter((assignment) => assignment.visitDate.slice(0, 10) === currentCampaignDateKey)
          .map(planItemFromAssignment);
        if (!cachedSurveyorPlanItems.length || assignments.length >= cachedSurveyorPlanItems.length) {
          cachedSurveyorPlanItems = assignments;
          setPlanItems(assignments);
        }
      })
      .catch(() => undefined);
    api.mySurveys()
      .then((result) => {
        if (!active) return;
        cachedSurveyorHistoryItems = result.surveys;
        setHistoryItems(result.surveys);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (view === 'list' && previousSurveyorView.current !== 'list') {
      setMobileSlideIndex(0);
    }
    previousSurveyorView.current = view;
  }, [view]);

  useEffect(() => {
    if (!isMobileLayout) return;
    const slider = listSliderRef.current;
    if (!slider) return;
    const slideStep = getListSlideStep();
    slideProgrammaticTarget.current = mobileSlideIndex;
    if (slideProgrammaticClearTimer.current) window.clearTimeout(slideProgrammaticClearTimer.current);
    slideProgrammaticClearTimer.current = window.setTimeout(() => {
      slideProgrammaticTarget.current = null;
      slideProgrammaticClearTimer.current = null;
    }, 560);
    slider.scrollTo({
      left: mobileSlideIndex * slideStep,
      behavior: 'smooth',
    });
  }, [isMobileLayout, mobileSlideIndex]);

  useEffect(
    () => () => {
      if (slideScrollSettleTimer.current) window.clearTimeout(slideScrollSettleTimer.current);
      if (slideProgrammaticClearTimer.current) window.clearTimeout(slideProgrammaticClearTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!address.province) return;
    let active = true;
    api
      .cities(address.province)
      .then((result) => {
        if (!active) return;
        setLocationOptions((current) => ({ ...current, cities: result.cities, districts: [], villages: [] }));
        setAddress((current) => ({
          ...current,
          city: result.cities.includes(current.city) ? current.city : '',
          district: result.cities.includes(current.city) ? current.district : '',
          village: result.cities.includes(current.city) ? current.village : '',
        }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [address.province]);

  useEffect(() => {
    if (!address.province || !address.city) return;
    let active = true;
    api
      .districts(address.province, address.city)
      .then((result) => {
        if (!active) return;
        setLocationOptions((current) => ({ ...current, districts: result.districts, villages: [] }));
        setAddress((current) => ({
          ...current,
          district: result.districts.includes(current.district) ? current.district : '',
          village: result.districts.includes(current.district) ? current.village : '',
        }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [address.province, address.city]);

  useEffect(() => {
    if (!address.province || !address.city || !address.district) return;
    let active = true;
    api
      .villages(address.province, address.city, address.district)
      .then((result) => {
        if (!active) return;
        setLocationOptions((current) => ({ ...current, villages: result.villages }));
        setAddress((current) => ({
          ...current,
          village: result.villages.includes(current.village) ? current.village : '',
        }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [address.province, address.city, address.district]);

  useEffect(() => {
    if (!address.province || !address.city || !address.district || !address.village) {
      setLocationValid(null);
      return;
    }

    let active = true;
    api
      .validateLocation(address)
      .then((result) => {
        if (active) setLocationValid(result.valid);
      })
      .catch(() => {
        if (active) setLocationValid(false);
      });
    return () => {
      active = false;
    };
  }, [address]);

  const renderSurveyStep = () => {
    if (step === 0) {
      return (
        <Stack spacing={2} className="survey-location-step">
          <Paper className="gps-panel survey-location-panel">
            <Stack spacing={1.3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
                <Box>
                  <SurveyQuestionLabel label="GPS Auto Capture" hint={getSurveyHint('GPS Auto Capture')} strong requirement="required" />
                  <Typography variant="caption" color="text.secondary">
                    Capture GPS terlebih dahulu. Provinsi, kota, kecamatan, dan desa/kelurahan akan diisi otomatis jika titik masuk boundary.
                  </Typography>
                </Box>
                <Button variant="contained" startIcon={<PinDropRoundedIcon />} onClick={captureGps}>
                  Capture GPS
                </Button>
              </Stack>
              <GpsMapPreview
                surveyLatitude={surveyForm.latitude}
                surveyLongitude={surveyForm.longitude}
                targetLatitude={selectedPlanItem?.latitude}
                targetLongitude={selectedPlanItem?.longitude}
                accuracy={surveyForm.gpsAccuracy}
                distance={surveyForm.gpsDistanceFromTarget}
                language={language}
              />
              <Box className="review-summary-grid">
                <SignalItem label="Latitude" value={surveyForm.latitude || '-'} tone="info" />
                <SignalItem label="Longitude" value={surveyForm.longitude || '-'} tone="info" />
                <SignalItem label="Accuracy" value={surveyForm.gpsAccuracy ? `${surveyForm.gpsAccuracy}m` : '-'} tone="success" />
                <SignalItem label="Distance" value={`${surveyForm.gpsDistanceFromTarget}m`} tone={surveyForm.gpsDistanceFromTarget > 100 ? 'warning' : 'success'} />
              </Box>
            </Stack>
          </Paper>

          <Stack spacing={2}>
            <Box className="address-grid">
              <HintedTextField select required label="Province" value={address.province} onChange={(event) => setAddress((current) => ({ ...current, province: event.target.value }))}>
                <MenuItem value="">
                  <em>Pilih provinsi</em>
                </MenuItem>
                {locationOptions.provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </HintedTextField>
              <HintedTextField select required label="City" value={address.city} onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} disabled={!address.province}>
                <MenuItem value="">
                  <em>Pilih kota/kabupaten</em>
                </MenuItem>
                {locationOptions.cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </HintedTextField>
              <HintedTextField select required label="Kecamatan" value={address.district} onChange={(event) => setAddress((current) => ({ ...current, district: event.target.value }))} disabled={!address.city}>
                <MenuItem value="">
                  <em>Pilih kecamatan</em>
                </MenuItem>
                {locationOptions.districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </HintedTextField>
              <HintedTextField select required label="Desa/Kelurahan" value={address.village} onChange={(event) => setAddress((current) => ({ ...current, village: event.target.value }))} disabled={!address.district}>
                <MenuItem value="">
                  <em>Pilih desa/kelurahan</em>
                </MenuItem>
                {locationOptions.villages.map((village) => (
                  <MenuItem key={village} value={village}>
                    {village}
                  </MenuItem>
                ))}
              </HintedTextField>
            </Box>
            <HintedTextField required={showFullSurveyFlow} requirement={showFullSurveyFlow ? 'required' : 'optional'} label="Detailed Address" value={surveyForm.addressDetail} onChange={(event) => updateSurveyForm('addressDetail', event.target.value)} multiline minRows={2} />
            <HintedTextField required={showFullSurveyFlow} requirement={showFullSurveyFlow ? 'required' : 'optional'} label="Landmark / patokan" value={surveyForm.landmark} onChange={(event) => updateSurveyForm('landmark', event.target.value)} />
            <Chip
              icon={locationValid ? <VerifiedRoundedIcon /> : <WarningAmberRoundedIcon />}
              label={
                locationValid === null
                  ? 'Pilih alamat lengkap dari master lokasi Jawa'
                  : locationValid
                    ? 'Alamat valid dari master lokasi Jawa'
                    : 'Kombinasi alamat tidak ditemukan di master lokasi'
              }
              color={locationValid ? 'success' : locationValid === false ? 'error' : 'warning'}
              variant={locationValid ? 'filled' : 'outlined'}
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>

          <Box className="survey-step-grid survey-outcome-grid">
            <Stack spacing={2}>
              <SingleChoiceChips
                label="Q1. Visit Outcome"
                options={visitOutcomeOptions}
                value={surveyForm.visitOutcome}
                onChange={(value) => {
                  updateSurveyForm('visitOutcome', value);
                  setStep(0);
                }}
              />
              {visitException && (
                <Alert severity="info" variant="outlined">
                  Outcome ini memakai jalur kunjungan singkat. Surveyor hanya perlu memastikan lokasi, mengisi alasan/kondisi, lalu submit untuk verifikasi.
                </Alert>
              )}
            </Stack>
            <Stack spacing={2}>
              <HintedTextField label="Selected store" value={storeName} disabled />
              <HintedTextField requirement="optional" label="Store alias / nama papan toko" value={surveyForm.storeAlias} onChange={(event) => updateSurveyForm('storeAlias', event.target.value)} />
              <Chip size="small" label={surveyForm.plannedOrUnplanned} color={surveyForm.plannedOrUnplanned === 'PLANNED' ? 'primary' : 'warning'} sx={{ alignSelf: 'flex-start' }} />
            </Stack>
          </Box>

          {visitException && (
            <Stack spacing={2}>
              <HintedTextField
                label="Catatan alasan/kondisi kunjungan"
                required
                value={surveyForm.surveyorNotes}
                onChange={(event) => updateSurveyForm('surveyorNotes', event.target.value)}
                multiline
                minRows={3}
              />
              <EvidenceTile
                label="Foto bukti kunjungan (opsional)"
                value={surveyForm.storefrontPhotoUrl}
                onCapture={(value) => updateSurveyForm('storefrontPhotoUrl', value)}
                onClear={() => updateSurveyForm('storefrontPhotoUrl', '')}
              />
            </Stack>
          )}
        </Stack>
      );
    }

    if (step === 1 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <Box className="address-grid">
            <HintedTextField requirement="optional" label="PIC / narasumber" value={surveyForm.contactPersonName} onChange={(event) => updateSurveyForm('contactPersonName', event.target.value)} />
            <HintedTextField requirement="optional" label="WhatsApp number" value={surveyForm.whatsappNumber} onChange={(event) => updateSurveyForm('whatsappNumber', event.target.value)} placeholder="08xx..." />
          </Box>
          <SingleChoiceChips label="Q11. PIC Type" options={picTypeOptions} value={surveyForm.picType} onChange={(value) => updateSurveyForm('picType', value)} />
          {!surveyForm.whatsappNumber.trim() && (
            <SingleChoiceChips
              label="Q13. Reason if WhatsApp Empty"
              options={waEmptyReasonOptions}
              value={surveyForm.waEmptyReason}
              onChange={(value) => updateSurveyForm('waEmptyReason', value)}
            />
          )}
          <SingleChoiceChips
            label="Q14. Purchasing Decision Maker"
            options={decisionMakerOptions}
            value={surveyForm.purchasingDecisionMaker}
            onChange={(value) => updateSurveyForm('purchasingDecisionMaker', value)}
          />
          <SingleChoiceChips
            label="Q15. Decision Maker Availability"
            options={decisionAvailabilityOptions}
            value={surveyForm.decisionMakerAvailability}
            onChange={(value) => updateSurveyForm('decisionMakerAvailability', value)}
          />
        </Stack>
      );
    }

    if (step === 2 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <SingleChoiceChips label="Q16. Main Business Type" options={businessTypeOptions} value={surveyForm.businessType} onChange={(value) => updateSurveyForm('businessType', value)} />
          <MultiChoiceChips
            label="Q17. Vehicle Specialization"
            options={vehicleSpecializationOptions}
            value={surveyForm.vehicleSpecialization}
            onChange={(value) => updateSurveyForm('vehicleSpecialization', value)}
          />
          <SingleChoiceChips label="Q18. Store Scale Estimate" options={storeScaleOptions} value={surveyForm.storeScale} onChange={(value) => updateSurveyForm('storeScale', value)} />
        </Stack>
      );
    }

    if (step === 3 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <MultiChoiceChips
            label="Q19. Cooling Products Seen / Sold"
            options={coolingProductOptions}
            value={surveyForm.coolingProducts}
            onChange={(value) => updateSurveyForm('coolingProducts', value)}
          />
          <SingleChoiceChips label="Q20. Cooling Shelf / Stock Size" options={coolingShelfOptions} value={surveyForm.coolingShelfSize} onChange={(value) => updateSurveyForm('coolingShelfSize', value)} />
          <SingleChoiceChips label="Q21. Cooling Sales Activity" options={coolingActivityOptions} value={surveyForm.coolingSalesActivity} onChange={(value) => updateSurveyForm('coolingSalesActivity', value)} />
        </Stack>
      );
    }

    if (step === 4 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <MultiChoiceChips label="Q22. Cooling Brands Seen / Sold" options={coolingBrandOptions} value={surveyForm.coolingBrands} onChange={(value) => updateSurveyForm('coolingBrands', value)} />
          <HintedTextField requirement="optional" label="Other brand / supplier brand manual" value={surveyForm.otherCoolingBrand} onChange={(event) => updateSurveyForm('otherCoolingBrand', event.target.value)} />
          <SingleChoiceChips label="Q23. Product Selling Segment" options={productSegmentOptions} value={surveyForm.productSellingSegment} onChange={(value) => updateSurveyForm('productSellingSegment', value)} />
          <SingleChoiceChips label="Q24. Low Cost Import Share" options={lowCostShareOptions} value={surveyForm.lowCostImportShare} onChange={(value) => updateSurveyForm('lowCostImportShare', value)} />
          <MultiChoiceChips label="Q25. Supplier Type" options={supplierTypeOptions} value={surveyForm.supplierType} onChange={(value) => updateSurveyForm('supplierType', value)} />
          <HintedTextField requirement="optional" label="Q26. Existing supplier name" value={surveyForm.supplierName} onChange={(event) => updateSurveyForm('supplierName', event.target.value)} />
          <SingleChoiceChips label="Q27. Supplier Dependency" options={supplierDependencyOptions} value={surveyForm.supplierDependency} onChange={(value) => updateSurveyForm('supplierDependency', value)} />
          <SingleChoiceChips label="Q28. Supplier Satisfaction" options={supplierSatisfactionOptions} value={surveyForm.supplierSatisfaction} onChange={(value) => updateSurveyForm('supplierSatisfaction', value)} />
          <SingleChoiceChips label="Q29. Return Ease" options={returnEaseOptions} value={surveyForm.returnEase} onChange={(value) => updateSurveyForm('returnEase', value)} />
          <SingleChoiceChips label="Q30. Delivery Speed" options={deliverySpeedOptions} value={surveyForm.deliverySpeed} onChange={(value) => updateSurveyForm('deliverySpeed', value)} />
        </Stack>
      );
    }

    if (step === 5 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <SingleChoiceChips label="Q31. Restock Frequency" options={restockFrequencyOptions} value={surveyForm.restockFrequency} onChange={(value) => updateSurveyForm('restockFrequency', value)} />
          <SingleChoiceChips label="Q32. Average Purchase Size" options={purchaseSizeOptions} value={surveyForm.purchaseSizeRange} onChange={(value) => updateSurveyForm('purchaseSizeRange', value)} />
          <SingleChoiceChips label="Estimated Monthly Purchase Value" options={monthlyPurchaseOptions} value={surveyForm.monthlyPurchaseValue} onChange={(value) => updateSurveyForm('monthlyPurchaseValue', value)} />
          <SingleChoiceChips label="Q33. Payment Method" options={paymentMethodOptions} value={surveyForm.paymentMethod} onChange={(value) => updateSurveyForm('paymentMethod', value)} />
          <SingleChoiceChips label="Margin Expectation" options={marginExpectationOptions} value={surveyForm.marginExpectation} onChange={(value) => updateSurveyForm('marginExpectation', value)} />
          <MultiChoiceChips label="Current Order Method" options={orderMethodOptions} value={surveyForm.currentOrderMethod} onChange={(value) => updateSurveyForm('currentOrderMethod', value)} />
          <MultiChoiceChips label="Q34. Main Purchase Driver" options={purchaseDriverOptions} value={surveyForm.mainPurchaseDriver} onChange={(value) => updateSurveyForm('mainPurchaseDriver', value)} max={3} />
          <SingleChoiceChips label="Q35. Store Price Sensitivity" options={priceSensitivityOptions} value={surveyForm.priceSensitivity} onChange={(value) => updateSurveyForm('priceSensitivity', value)} />
        </Stack>
      );
    }

    if (step === 6 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <SingleChoiceChips label="Q36. Openness to New Alternative Brand" options={opennessOptions} value={surveyForm.opennessToNewSupplier} onChange={(value) => updateSurveyForm('opennessToNewSupplier', value)} />
          <MultiChoiceChips label="Q37. Main Reason to Try New Supplier" options={reasonTryOptions} value={surveyForm.reasonToTryNewSupplier} onChange={(value) => updateSurveyForm('reasonToTryNewSupplier', value)} max={3} />
          <SingleChoiceChips label="Q38. Willingness to Receive Follow-up" options={followUpOptions} value={surveyForm.willingnessToReceiveFollowUp} onChange={(value) => updateSurveyForm('willingnessToReceiveFollowUp', value)} />
        </Stack>
      );
    }

    if (step === 7 && showFullSurveyFlow) {
      return (
        <Stack spacing={2}>
          <EvidenceTile label="Q39. Foto Tampak Depan Toko" value={surveyForm.storefrontPhotoUrl} required onCapture={(value) => updateSurveyForm('storefrontPhotoUrl', value)} onClear={() => updateSurveyForm('storefrontPhotoUrl', '')} />
          <EvidenceTile label="Q40. Foto Dalam Toko / Rak" value={surveyForm.interiorPhotoUrl} onCapture={(value) => updateSurveyForm('interiorPhotoUrl', value)} onClear={() => updateSurveyForm('interiorPhotoUrl', '')} />
          {!surveyForm.interiorPhotoUrl && (
            <SingleChoiceChips label="Alasan foto dalam/rak kosong" options={photoMissingReasonOptions} value={surveyForm.interiorPhotoMissingReason} onChange={(value) => updateSurveyForm('interiorPhotoMissingReason', value)} />
          )}
          <EvidenceTile label="Q41. Foto dengan Narasumber / PIC" value={surveyForm.picPhotoUrl} onCapture={(value) => updateSurveyForm('picPhotoUrl', value)} onClear={() => updateSurveyForm('picPhotoUrl', '')} />
          {!surveyForm.picPhotoUrl && (
            <SingleChoiceChips label="Alasan foto PIC kosong" options={photoMissingReasonOptions} value={surveyForm.picPhotoMissingReason} onChange={(value) => updateSurveyForm('picPhotoMissingReason', value)} />
          )}
          <HintedTextField requirement="optional" label="Q42. Surveyor notes" value={surveyForm.surveyorNotes} onChange={(event) => updateSurveyForm('surveyorNotes', event.target.value)} multiline minRows={3} />
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <Box className="review-summary-grid">
          <ScoreBadge label="Store" value={storeName.slice(0, 16)} caption={selectedPlanItem?.tag ?? 'Selected store'} tone="#61c8ff" />
          {visitException ? (
            <>
              <ScoreBadge label="Outcome" value={surveyForm.visitOutcome} caption="Visit exception" tone="#f5c84c" />
              <ScoreBadge label="GPS" value={surveyForm.latitude ? 'Captured' : '-'} caption={`${surveyForm.gpsDistanceFromTarget}m dari target`} tone="#2fd0a8" />
            </>
          ) : (
            <>
              <ScoreBadge label="Cooling Products" value={String(surveyForm.coolingProducts.length)} caption={surveyForm.coolingSalesActivity} tone="#2fd0a8" />
              <ScoreBadge label="Openness" value={surveyForm.opennessToNewSupplier} caption={surveyForm.willingnessToReceiveFollowUp} tone="#f5c84c" />
            </>
          )}
        </Box>
        <Paper className="review-box">
          <Typography fontWeight={900}>Review sebelum submit</Typography>
          <Typography variant="body2" color="text.secondary">
            {address.province} / {address.city} / {address.district} / {address.village}
          </Typography>
          {visitException ? (
            <>
              <Typography variant="body2">Outcome: {surveyForm.visitOutcome}</Typography>
              <Typography variant="body2">Catatan: {surveyForm.surveyorNotes || '-'}</Typography>
              <Typography variant="body2">Foto bukti: {surveyForm.storefrontPhotoUrl ? 'Ada' : 'Tidak ada'}</Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">
                Produk: {surveyForm.coolingProducts.join(', ')}
              </Typography>
              <Typography variant="body2">
                Supplier: {surveyForm.supplierType.join(', ')} {surveyForm.supplierName ? `- ${surveyForm.supplierName}` : ''}
              </Typography>
            </>
          )}
        </Paper>
        {blockingErrors.length > 0 && (
          <Alert severity="warning" variant="outlined">
            {blockingErrors.slice(0, 4).join(' ')}
          </Alert>
        )}
        {warningMessages.length > 0 && (
          <Stack spacing={1}>
            {warningMessages.map((message) => (
              <Chip key={message} icon={<WarningAmberRoundedIcon />} label={message} color="warning" variant="outlined" sx={{ justifyContent: 'flex-start', minHeight: 40 }} />
            ))}
          </Stack>
        )}
      </Stack>
    );

  };

  return (
    <Box className={`surveyor-layout ${view}-page ${storeName ? 'has-selected-store' : ''}`}>
      {view === 'list' && (
        <Box className="surveyor-list-shell">
          <Box className="surveyor-slide-indicator" role="tablist" aria-label="Indikator ruang kerja surveyor">
            {surveyorListSlideLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                className={mobileSlideIndex === index ? 'active' : ''}
                aria-selected={mobileSlideIndex === index}
                onClick={() => goToMobileSlide(index)}
              >
                <span className="slide-dot" />
                <span>{pwaText(label)}</span>
              </button>
            ))}
          </Box>
        <Box
          ref={listSliderRef}
          className="surveyor-list-slides"
          aria-label="Field survey workspace sections"
          onTouchStart={handleListSlideTouchStart}
          onTouchEnd={handleListSlideTouchEnd}
          onWheel={handleListSlideWheel}
          onScroll={handleListSlideScroll}
        >
          <Box className="surveyor-list-slide today-plan-slide">
      <Paper className="mobile-shell">
        <Box className="phone-status">
          <Typography variant="caption">09:42</Typography>
          <Stack direction="row" spacing={0.5}>
            <Box className="status-dot" />
            <Box className="status-dot" />
            <Box className="status-dot dim" />
          </Stack>
        </Box>
        <Stack spacing={2} className="phone-content">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="caption" color="text.secondary">
                {pwaText('Assigned Visits')}
              </Typography>
              <Typography variant="h6">{planItems.length || 0} kunjungan</Typography>
            </Box>
            <PolibeliLogo size={40} />
          </Stack>
          <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="fullWidth">
            <Tab label={pwaText('Plan')} />
            <Tab label={pwaText('Draft')} />
            <Tab label={pwaText('History')} />
          </Tabs>
          <Stack spacing={1.2}>
            {tab === 0 &&
              planItems.map((item) => (
                <Paper
                  key={item.name}
                  role="button"
                  tabIndex={0}
                  className={`visit-card ${storeName === item.name ? 'active' : ''}`}
                  onClick={() => selectStoreForSurvey(item.name)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      selectStoreForSurvey(item.name);
                    }
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar variant="rounded" sx={{ bgcolor: storeName === item.name ? 'primary.main' : 'background.paper' }}>
                      <StorefrontRoundedIcon />
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Typography fontWeight={900} noWrap data-no-i18n>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.area} - {pwaText(item.tag)}
                      </Typography>
                    </Box>
                    <Chip size="small" label={pwaText(item.status)} color={storeName === item.name ? 'primary' : item.status === 'Submitted' ? 'success' : 'default'} />
                  </Stack>
                </Paper>
              ))}
            {tab === 1 && (
              <Paper className="visit-card">
                <Typography fontWeight={900}>{draftSavedAt ? 'Draft tersedia' : 'Belum ada draft tersimpan'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {draftSavedAt ? `${storeName} disimpan pada ${draftSavedAt}` : 'Tekan Save Draft di form survey untuk menyimpan pekerjaan sementara.'}
                </Typography>
                <Button size="small" sx={{ mt: 1 }} onClick={loadDraft}>
                  {pwaText('Load Draft')}
                </Button>
              </Paper>
            )}
            {tab === 2 && (
              <Stack spacing={1}>
                {historyItems.length ? (
                  historyItems.slice(0, 5).map((item) => (
                    <Paper key={item.id} className="visit-card">
                      <Typography fontWeight={900} data-no-i18n>
                        {item.storeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.merchantGrade} / {dataQualityGradeLabel(item.dataQualityGrade, language)} - {leadClassificationLabel(item.leadClassification, language)}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Paper className="visit-card">
                    <Typography fontWeight={900}>History submit hari ini</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lastSubmittedStore ? `${lastSubmittedStore} sudah masuk queue verifikasi.` : 'Belum ada survey yang disubmit pada sesi ini.'}
                    </Typography>
                  </Paper>
                )}
              </Stack>
            )}
          </Stack>
          <Button variant="contained" size="large" startIcon={<AddLocationAltRoundedIcon />} onClick={() => setUnplannedOpen(true)}>
            {pwaText('Add Manual Visit')}
          </Button>
        </Stack>
      </Paper>
          </Box>
          <Box className="surveyor-list-stack">
          <Box className="surveyor-list-slide revision-slide">
          <Paper className="section-panel revision-store-card">
            <SectionTitle
              icon={<SyncProblemRoundedIcon />}
              title={pwaText('Revision Queue')}
              action={<Chip size="small" label={`${revisionItems.length} laporan`} color={revisionItems.length ? 'warning' : 'default'} variant="outlined" />}
            />
            <Typography variant="body2" color="text.secondary">
              {t('Reports returned by verification and waiting for surveyor correction.')}
            </Typography>
            {revisionItems.length ? (
              <Stack spacing={1.3} className="revision-list">
                {revisionItems.map((row) => (
                  <Box key={row.id} className="revision-item">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} gap={1.2}>
                      <Stack direction="row" spacing={1.2} minWidth={0}>
                        <Avatar variant="rounded" className="revision-avatar">
                          <PublishedWithChangesRoundedIcon />
                        </Avatar>
                        <Box minWidth={0}>
                          <Typography fontWeight={900} data-no-i18n>
                            {row.storeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.city} / {row.district} - {formatSurveyHistoryDate(row.submitTime, language)}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} />
                    </Stack>
                    <Box className="revision-note">
                      <Typography variant="caption" color="text.secondary">
                        {pwaText('Store revision notes')}
                      </Typography>
                      <Typography variant="body2">{row.revisionRequest || 'Belum ada instruksi revisi dari verificator.'}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap className="survey-chip-row">
                      <Chip size="small" label={`${pwaText('Merchant score')} ${row.merchantGrade} · ${row.merchantPotentialScore}/100`} variant="outlined" />
                      <Chip size="small" label={`${pwaText('Data quality')} ${dataQualityGradeLabel(row.dataQualityGrade, language)} · ${row.dataQualityScore}/100`} variant="outlined" />
                      <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color="primary" variant="outlined" />
                    </Stack>
                    <Button size="small" variant="contained" startIcon={<EditLocationAltRoundedIcon />} onClick={() => openSurveyFromHistory(row, 'revision')}>
                      {pwaText('Continue Revision')}
                    </Button>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box className="empty-state-inline">
                <CheckCircleRoundedIcon />
                <Typography variant="body2" color="text.secondary">
                  {t('Tidak ada laporan yang perlu direvisi.')}
                </Typography>
              </Box>
            )}
          </Paper>
          </Box>
          <Box className="surveyor-list-slide survey-history-slide">
          <Paper className="section-panel surveyed-history-card">
            <SectionTitle
              icon={<AssignmentTurnedInRoundedIcon />}
              title={pwaText('Submitted Reports')}
              action={<Chip size="small" label={`${historyItems.length} ${pwaText('Report')}`} color="primary" variant="outlined" />}
            />
            <Typography variant="body2" color="text.secondary">
              Dikelompokkan per tanggal dan status verifikasi.
            </Typography>
            {historyDateGroups.length ? (
              <Stack spacing={2} className="survey-history-groups">
                {historyDateGroups.map((dateGroup) => (
                  <Box key={dateGroup.dateKey} className="survey-history-date-group">
                    <Stack direction="row" spacing={1} alignItems="center" className="survey-history-date-title">
                      <CalendarMonthRoundedIcon fontSize="small" />
                      <Typography fontWeight={900}>{dateGroup.dateLabel}</Typography>
                    </Stack>
                    <Stack spacing={1.3}>
                      {dateGroup.statusGroups.map((statusGroup) => (
                        <Box key={`${dateGroup.dateKey}-${statusGroup.status}`} className="survey-status-group">
                          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                            <Chip size="small" label={verificationStatusLabel(statusGroup.status, language)} color={statusChipColor(statusGroup.status)} variant="outlined" />
                            <Typography variant="caption" color="text.secondary">
                              {statusGroup.items.length} {pwaText('Report')}
                            </Typography>
                          </Stack>
                          <Stack spacing={1} className="survey-history-rows">
                            {statusGroup.items.map((row) => (
                              <Box key={row.id} className="survey-history-row">
                                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.2}>
                                  <Box minWidth={0}>
                                    <Typography fontWeight={900} data-no-i18n>
                                      {row.storeName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatSurveyHistoryTime(row.submitTime, language)} - {row.city} / {row.district}
                                    </Typography>
                                  </Box>
                                  <Button
                                    size="small"
                                    variant={row.verificationStatus === 'NEED_REVISION' ? 'contained' : 'outlined'}
                                    startIcon={row.verificationStatus === 'NEED_REVISION' ? <EditLocationAltRoundedIcon /> : <VisibilityRoundedIcon />}
                                    onClick={() => openSurveyFromHistory(row, row.verificationStatus === 'NEED_REVISION' ? 'revision' : 'detail')}
                                  >
                                    {row.verificationStatus === 'NEED_REVISION' ? pwaText('Continue Revision') : pwaText('View Report')}
                                  </Button>
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap className="survey-chip-row">
                                  <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color="primary" variant="outlined" />
                                  <Chip size="small" label={`${pwaText('Merchant score')} ${row.merchantGrade} · ${row.merchantPotentialScore}/100`} variant="outlined" />
                                  <Chip size="small" label={`${pwaText('Data quality')} ${dataQualityGradeLabel(row.dataQualityGrade, language)} · ${row.dataQualityScore}/100`} variant="outlined" />
                                </Stack>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box className="empty-state-inline">
                <HistoryRoundedIcon />
                <Typography variant="body2" color="text.secondary">
                  {t('Belum ada laporan terkirim.')}
                </Typography>
              </Box>
            )}
          </Paper>
          </Box>
          </Box>
        </Box>
        </Box>
      )}

      {view === 'detail' && (storeName ? (
        <Stack spacing={3} minWidth={0}>
          <Paper className="section-panel survey-detail-header">
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1.5}>
              <Stack spacing={0.4} minWidth={0}>
                <Typography variant="caption" color="text.secondary">
                  {pwaText('Cooling survey form')}
                </Typography>
                <Typography variant="h5" data-no-i18n>
                  {storeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPlanItem ? `${selectedPlanItem.area} - ${pwaText(selectedPlanItem.tag)}` : t('Unplanned store')}
                </Typography>
              </Stack>
              <Button variant="outlined" startIcon={<KeyboardArrowRightRoundedIcon sx={{ transform: 'rotate(180deg)' }} />} onClick={onBackToList}>
                {pwaText('Back to Assigned Visits')}
              </Button>
            </Stack>
          </Paper>
          <Paper className="section-panel survey-wizard-card">
            <SectionTitle
              icon={<EditLocationAltRoundedIcon />}
              title={`${pwaText(activeSurveySteps[step] ?? activeSurveySteps[reviewStepIndex])} ${pwaText('Survey')}`}
              action={<Chip icon={<CloudSyncRoundedIcon />} label={`${pwaText('Step')} ${step + 1}/${activeSurveySteps.length}`} color="primary" variant="outlined" />}
            />
            <Stepper activeStep={step} alternativeLabel className="survey-stepper">
              {activeSurveySteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{pwaText(label)}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box className="mobile-step-progress">
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Typography fontWeight={900}>{pwaText(activeSurveySteps[step] ?? activeSurveySteps[reviewStepIndex])}</Typography>
                <Chip size="small" label={`${pwaText('Step')} ${step + 1}/${activeSurveySteps.length}`} color="primary" />
              </Stack>
              <LinearProgress variant="determinate" value={((step + 1) / activeSurveySteps.length) * 100} />
            </Box>
            {renderSurveyStep()}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5} mt={3} className="survey-action-bar">
              <Button startIcon={<HistoryRoundedIcon />} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                {pwaText('Back')}
              </Button>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" startIcon={<CloudSyncRoundedIcon />} onClick={saveDraft}>
                  {pwaText('Save Draft')}
                </Button>
                {step < activeSurveySteps.length - 1 ? (
                  <Button variant="contained" endIcon={<TaskAltRoundedIcon />} onClick={() => setStep(Math.min(activeSurveySteps.length - 1, step + 1))}>
                    {pwaText('Next')}
                  </Button>
                ) : (
                  <Button variant="contained" startIcon={<TaskAltRoundedIcon />} onClick={submitSurvey} disabled={submitting || blockingErrors.length > 0}>
                    {selectedStoreSubmitLocked ? 'Sudah tersubmit' : submitting ? pwaText('Submitting...') : pwaText('Submit Survey')}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>

          <Paper className="section-panel">
            <SectionTitle icon={<FlashOnRoundedIcon />} title={pwaText('Submission Result')} />
            {submittedScore ? (
              <Box className="score-grid">
                {submittedVisitIncomplete ? (
                  <>
                    <ScoreBadge label="Outcome" value={compactVisitOutcomeLabel(submittedScore.visitOutcome, language)} caption={verificationStatusLabel(submittedScore.verificationStatus, language)} tone="#f5c84c" />
                    <ScoreBadge label={pwaText('Data Quality')} value={dataQualityGradeLabel(submittedScore.dataQualityGrade, language)} caption={`${submittedScore.dataQualityScore}/100`} tone="#2fd0a8" />
                    <ScoreBadge label="Report Type" value={leadClassificationLabel(submittedScore.leadClassification, language)} caption={submittedScore.storeCode} tone="#61c8ff" />
                  </>
                ) : (
                  <>
                    <ScoreBadge label={pwaText('Merchant Potential')} value={submittedScore.merchantGrade} caption={`${submittedScore.merchantPotentialScore}/100`} tone="#f5c84c" />
                    <ScoreBadge label={pwaText('Data Quality')} value={dataQualityGradeLabel(submittedScore.dataQualityGrade, language)} caption={`${submittedScore.dataQualityScore}/100`} tone="#2fd0a8" />
                    <ScoreBadge label={pwaText('Lead Type')} value={leadClassificationLabel(submittedScore.leadClassification, language)} caption={submittedScore.storeCode} tone="#61c8ff" />
                  </>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Score akan muncul setelah survey berhasil disubmit dan dihitung oleh backend.
              </Typography>
            )}
          </Paper>
        </Stack>
      ) : (
        <Paper className="section-panel empty-survey-panel">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Avatar variant="rounded" className="section-icon" sx={{ width: 56, height: 56 }}>
              <StorefrontRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h5">{pwaText('Choose an assigned visit to start')}</Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={520}>
                {language === 'en'
                  ? 'Select a visit from the assigned list. The full survey form appears after a store is selected, so surveyors always work with the correct store context.'
                  : language === 'zh'
                    ? '\u8bf7\u4ece\u5df2\u5206\u914d\u5217\u8868\u4e2d\u9009\u62e9\u4e00\u6b21\u62dc\u8bbf\u3002\u9009\u62e9\u95e8\u5e97\u540e\u624d\u4f1a\u663e\u793a\u5b8c\u6574\u8c03\u7814\u8868\uff0c\u786e\u4fdd\u8c03\u7814\u5458\u59cb\u7ec8\u5728\u6b63\u786e\u7684\u95e8\u5e97\u4e0a\u4e0b\u6587\u4e2d\u586b\u5199\u3002'
                    : 'Pilih kunjungan dari daftar terjadwal. Form survei lengkap baru akan muncul setelah toko dipilih, supaya surveyor selalu mengisi data sesuai konteks toko.'}
              </Typography>
            </Box>
            <Chip icon={<EditLocationAltRoundedIcon />} label={pwaText('Select a visit from the list')} color="primary" variant="outlined" />
          </Stack>
        </Paper>
      ))}
      <Dialog open={unplannedOpen} onClose={() => setUnplannedOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{pwaText('Add Manual Visit')}</DialogTitle>
        <DialogContent>
          <HintedTextField
            label={pwaText('Store name')}
            value={unplannedName}
            onChange={(event) => setUnplannedName(event.target.value)}
            placeholder="Nama toko baru"
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnplannedOpen(false)}>{pwaText('Cancel')}</Button>
          <Button variant="contained" onClick={addUnplannedStore} disabled={!unplannedName.trim()}>
            {pwaText('Add Store')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={submitOpen} onClose={() => setSubmitOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Survey Submitted</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2}>
            <Typography fontWeight={900} data-no-i18n>
              {submittedScore?.storeName ?? storeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {address.province} / {address.city} / {address.district} / {address.village}
            </Typography>
            {submittedScore && (
              <Box className="score-grid">
                {submittedVisitIncomplete ? (
                  <>
                    <ScoreBadge label="Outcome" value={compactVisitOutcomeLabel(submittedScore.visitOutcome, language)} caption={verificationStatusLabel(submittedScore.verificationStatus, language)} tone="#f5c84c" />
                    <ScoreBadge label={pwaText('Data quality')} value={dataQualityGradeLabel(submittedScore.dataQualityGrade, language)} caption={`${submittedScore.dataQualityScore}/100`} tone="#2fd0a8" />
                    <ScoreBadge label="Report Type" value={leadClassificationLabel(submittedScore.leadClassification, language)} caption={submittedScore.storeCode} tone="#61c8ff" />
                  </>
                ) : (
                  <>
                    <ScoreBadge label={pwaText('Merchant Potential')} value={submittedScore.merchantGrade} caption={`${submittedScore.merchantPotentialScore}/100`} tone="#f5c84c" />
                    <ScoreBadge label={pwaText('Data quality')} value={dataQualityGradeLabel(submittedScore.dataQualityGrade, language)} caption={`${submittedScore.dataQualityScore}/100`} tone="#2fd0a8" />
                    <ScoreBadge label={pwaText('Lead Type')} value={leadClassificationLabel(submittedScore.leadClassification, language)} caption={verificationStatusLabel(submittedScore.verificationStatus, language)} tone="#61c8ff" />
                  </>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSubmitOpen(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}

const verificationDecisionLabels: Record<VerificationDecision, string> = {
  VERIFIED_VALID: 'Verified Valid',
  NEED_REVISION: 'Need Revision',
  REJECTED_INVALID: 'Rejected Invalid',
  MERGED_DUPLICATE: 'Merged Duplicate',
};

const openVerificationStatuses = ['WAITING_VERIFICATION', 'WAITING_VERIFICATION_WARNING'];
const verificationHistoryStatuses = ['VERIFIED_VALID', 'NEED_REVISION', 'REJECTED_INVALID', 'MERGED_DUPLICATE'];

function formatAge(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (Number.isNaN(elapsed)) return '-';
  const minutes = Math.max(1, Math.floor(elapsed / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam`;
  return `${Math.floor(hours / 24)} hari`;
}

function isHotOrQualified(row: SurveyHistoryItem) {
  return ['Hot Lead', 'Qualified Lead'].includes(row.leadClassification);
}

function hasMissingPhoto(row: SurveyHistoryItem) {
  return !row.interiorPhotoUrl || !row.picPhotoUrl || row.warningFlags.some((flag) => flag.includes('MISSING'));
}

function hasDuplicateWarning(row: SurveyHistoryItem) {
  return (row.duplicateCandidateCount ?? 0) > 0;
}

function visibleVerificationWarningFlags(row: SurveyHistoryItem) {
  const nonDuplicateFlags = row.warningFlags.filter((flag) => !flag.includes('DUPLICATE'));
  return hasDuplicateWarning(row) ? [...nonDuplicateFlags, 'POSSIBLE_DUPLICATE'] : nonDuplicateFlags;
}

function verificationWarningLabel(flag: string) {
  const labels: Record<string, string> = {
    GPS_WARNING_GT_100M: 'GPS >100m',
    WA_EMPTY_WITH_REASON: 'WA kosong',
    VERIFIER_WA_UNREACHABLE: 'WA tidak reachable',
    VERIFIER_PHONE_UNREACHABLE: 'Telepon tidak tersambung',
    MISSING_INTERIOR_PHOTO: 'Foto rak belum lengkap',
    MISSING_INTERIOR_PHOTO_WITH_REASON: 'Foto rak belum lengkap',
    MISSING_PIC_PHOTO: 'Foto PIC belum lengkap',
    MISSING_PIC_PHOTO_WITH_REASON: 'Foto PIC belum lengkap',
    VISIT_NOT_COMPLETED: 'Visit belum selesai',
    STORE_NAME_TOO_SHORT: 'Nama toko terlalu pendek',
    POSSIBLE_DUPLICATE: 'Kandidat duplikat',
  };
  return labels[flag] ?? flag.replaceAll('_', ' ');
}

function verificationPriority(row: SurveyHistoryItem) {
  if (hasDuplicateWarning(row)) return 1;
  if (visibleVerificationWarningFlags(row).length) return 2;
  if (isHotOrQualified(row)) return 3;
  if (row.gpsWarningFlag || row.gpsDistanceFromTarget > 100) return 4;
  if (hasMissingPhoto(row)) return 5;
  if (row.dataQualityScore < 60) return 6;
  return 7;
}

function priorityLabel(row: SurveyHistoryItem) {
  if (hasDuplicateWarning(row)) return 'Duplicate candidate';
  if (visibleVerificationWarningFlags(row).length) return 'Warning first';
  if (isHotOrQualified(row)) return 'Lead potential';
  if (row.gpsWarningFlag || row.gpsDistanceFromTarget > 100) return 'GPS warning';
  if (hasMissingPhoto(row)) return 'Missing photo';
  if (row.dataQualityScore < 60) return 'Quality risk';
  return 'Normal';
}

function normalizePhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

function whatsappUrl(phoneNumber: string, storeName: string, contactName: string) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return '';
  const message = `Halo ${contactName || 'Bapak/Ibu'}, saya follow up data survey KLWT untuk ${storeName}.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function phoneCallUrl(phoneNumber: string) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return '';
  return `tel:+${normalized}`;
}

function isVerifiedWaReachable(row: Pick<SurveyHistoryItem, 'whatsappNumber' | 'verifierWhatsappReachable'>) {
  if (!row.whatsappNumber) return false;
  return row.verifierWhatsappReachable ?? true;
}

function isVerifiedPhoneCallable(row: Pick<SurveyHistoryItem, 'whatsappNumber' | 'verifierPhoneCallable' | 'decisionMakerAvailability'>) {
  if (!row.whatsappNumber) return false;
  return row.verifierPhoneCallable ?? ['Selalu ada', 'By phone/WA', 'Ditemui langsung'].includes(row.decisionMakerAvailability);
}

function contactAssessmentLabel(value: boolean | null | undefined, positive: string, negative: string) {
  if (value === null || value === undefined) return 'Belum dicek verifikator';
  return value ? positive : negative;
}

function googleMapsUrl(latitude: string, longitude: string) {
  if (!latitude || !longitude) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
}

function evidenceStatus(value: string, missingReason: string) {
  if (value) return 'Available';
  return missingReason || 'Missing';
}

function statusChipColor(status: string) {
  if (status === 'VERIFIED_VALID') return 'success' as const;
  if (status === 'NEED_REVISION') return 'warning' as const;
  if (status === 'REJECTED_INVALID' || status === 'MERGED_DUPLICATE') return 'error' as const;
  return 'info' as const;
}

function duplicateSignalLabel(key: DuplicateMatchKey, language: AppLanguage) {
  const labels: Record<DuplicateMatchKey, Record<AppLanguage, string>> = {
    storeName: { id: 'Nama toko', en: 'Store name', zh: '\u95e8\u5e97\u540d\u79f0' },
    whatsappNumber: { id: 'Nomor WhatsApp', en: 'WhatsApp number', zh: 'WhatsApp \u53f7\u7801' },
    city: { id: 'Kota', en: 'City', zh: '\u57ce\u5e02' },
    district: { id: 'Kecamatan', en: 'District', zh: '\u533a\u53bf' },
    village: { id: 'Kelurahan/desa', en: 'Village', zh: '\u6751/\u793e\u533a' },
    addressDetail: { id: 'Alamat', en: 'Address', zh: '\u5730\u5740' },
    coordinates: { id: 'Koordinat <= 100m', en: 'Coordinates <= 100m', zh: '\u5750\u6807 <= 100 \u7c73' },
  };
  return localCopy(language, labels[key]);
}

function duplicateScoreReason(language: AppLanguage) {
  return localCopy(language, {
    id: 'Skor kecocokan duplikat memakai bobot: nama toko 30%, WA 25%, kota 10%, kecamatan 10%, kelurahan 8%, alamat 12%, dan koordinat dalam 100m 5%.',
    en: 'Duplicate match score uses these weights: store name 30%, WA 25%, city 10%, district 10%, village 8%, address 12%, and coordinates within 100m 5%.',
    zh: '重复匹配分使用权重：门店名称 30%、WA 25%、城市 10%、区县 10%、村/社区 8%、地址 12%、100 米内坐标 5%。',
  });
}

function submittedAgeMs(row: SurveyHistoryItem) {
  return new Date(row.submitTime).getTime();
}

function detailValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function VerificationPage() {
  const language = useCurrentLanguage();
  const t = (text: string) => translateInline(text, language);
  const [rows, setRows] = useState<SurveyHistoryItem[]>([]);
  const [reviewTargetId, setReviewTargetId] = useState('');
  const [expandedSurveyors, setExpandedSurveyors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDecision, setSavingDecision] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifierPhoneCallable, setVerifierPhoneCallable] = useState(false);
  const [verifierWhatsappReachable, setVerifierWhatsappReachable] = useState(false);
  const [revisionRequest, setRevisionRequest] = useState('');
  const [revisionAttempted, setRevisionAttempted] = useState(false);
  const [revisionDialogOpen, setRevisionDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateCompareOpen, setDuplicateCompareOpen] = useState(false);
  const [duplicateTargetId, setDuplicateTargetId] = useState('');
  const [duplicateTargetRow, setDuplicateTargetRow] = useState<SurveyHistoryItem | null>(null);
  const [duplicateSearch, setDuplicateSearch] = useState('');
  const [duplicateOnlyHighConfidence, setDuplicateOnlyHighConfidence] = useState(false);
  const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidate[]>([]);
  const [loadingDuplicateCandidates, setLoadingDuplicateCandidates] = useState(false);
  const duplicateRequestIdRef = useRef(0);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [verificationMetricDialog, setVerificationMetricDialog] = useState<VerificationMetricKey | null>(null);
  const [verificationMetricGroupsByKey, setVerificationMetricGroupsByKey] = useState<Partial<Record<VerificationMetricKey, VerificationMetricSurveyorGroup[]>>>({});
  const [verificationMetricTotalsByKey, setVerificationMetricTotalsByKey] = useState<Partial<Record<VerificationMetricKey, number>>>({});
  const [verificationMetricGroupsLoading, setVerificationMetricGroupsLoading] = useState(false);
  const [verificationMetricGroupsError, setVerificationMetricGroupsError] = useState('');
  const [expandedVerificationMetricSurveyors, setExpandedVerificationMetricSurveyors] = useState<Record<string, boolean>>({});
  const [verificationMetricStoresByKey, setVerificationMetricStoresByKey] = useState<
    Record<string, { loading: boolean; rows: SurveyHistoryItem[]; error: string }>
  >({});
  const [verificationMetricSummary, setVerificationMetricSummary] = useState<VerificationMetricSummary | null>(null);
  const [verificationMetricSummaryError, setVerificationMetricSummaryError] = useState('');
  const [verificationHistoryGroups, setVerificationHistoryGroups] = useState<VerificationHistorySurveyorGroup[]>([]);
  const [verificationHistoryTotal, setVerificationHistoryTotal] = useState(0);
  const [verificationHistoryLoading, setVerificationHistoryLoading] = useState(true);
  const [verificationHistoryError, setVerificationHistoryError] = useState('');
  const [expandedVerificationHistorySurveyors, setExpandedVerificationHistorySurveyors] = useState<string[]>([]);
  const [verificationHistoryStoresBySurveyor, setVerificationHistoryStoresBySurveyor] = useState<
    Record<string, { loading: boolean; rows: SurveyHistoryItem[]; error: string }>
  >({});
  const [annulTarget, setAnnulTarget] = useState<SurveyHistoryItem | null>(null);
  const [annulReason, setAnnulReason] = useState('');
  const [annullingVerification, setAnnullingVerification] = useState(false);

  const loadPendingSurveyorGroups = async () => {
    setLoading(true);
    try {
      const result = await api.verificationMetricSurveyors('pending');
      setVerificationMetricGroupsByKey((current) => ({ ...current, pending: result.groups }));
      setVerificationMetricTotalsByKey((current) => ({ ...current, pending: result.total }));
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Queue verifikasi gagal dimuat.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationHistoryGroups = async () => {
    setVerificationHistoryLoading(true);
    setVerificationHistoryError('');
    try {
      const result = await api.verificationHistorySurveyors();
      setVerificationHistoryGroups(result.groups);
      setVerificationHistoryTotal(result.total);
    } catch (error) {
      setVerificationHistoryError(error instanceof Error ? error.message : 'History verifikasi gagal dimuat.');
    } finally {
      setVerificationHistoryLoading(false);
    }
  };

  useEffect(() => {
    void loadPendingSurveyorGroups();
    void loadVerificationHistoryGroups();
  }, []);

  useEffect(() => {
    let active = true;
    api
      .verificationMetricSummary()
      .then((result) => {
        if (!active) return;
        setVerificationMetricSummary(result.summary);
        setVerificationMetricSummaryError('');
      })
      .catch((error) => {
        if (active) setVerificationMetricSummaryError(error instanceof Error ? error.message : 'Summary metrik verifikasi gagal dimuat.');
      });

    return () => {
      active = false;
    };
  }, []);

  const loadVerificationMetricGroups = async (metric: VerificationMetricKey) => {
    setVerificationMetricGroupsLoading(true);
    setVerificationMetricGroupsError('');
    try {
      const result = await api.verificationMetricSurveyors(metric);
      setVerificationMetricGroupsByKey((current) => ({ ...current, [metric]: result.groups }));
      setVerificationMetricTotalsByKey((current) => ({ ...current, [metric]: result.total }));
    } catch (error) {
      setVerificationMetricGroupsError(error instanceof Error ? error.message : 'Drill-down metrik verifikasi gagal dimuat.');
    } finally {
      setVerificationMetricGroupsLoading(false);
    }
  };

  const refreshVerificationMetricSummary = async () => {
    try {
      const result = await api.verificationMetricSummary();
      setVerificationMetricSummary(result.summary);
      setVerificationMetricSummaryError('');
    } catch (error) {
      setVerificationMetricSummaryError(error instanceof Error ? error.message : 'Summary metrik verifikasi gagal dimuat.');
    }
  };

  const openVerificationMetricDialog = (metric: VerificationMetricKey) => {
    setVerificationMetricDialog(metric);
    setExpandedVerificationMetricSurveyors({});
    setVerificationMetricGroupsError('');
    if (!verificationMetricGroupsByKey[metric]) {
      loadVerificationMetricGroups(metric);
    }
  };

  const loadVerificationMetricStores = async (metric: VerificationMetricKey, surveyorId: string) => {
    const cacheKey = verificationMetricStoreCacheKey(metric, surveyorId);
    setVerificationMetricStoresByKey((current) => ({
      ...current,
      [cacheKey]: { loading: true, rows: current[cacheKey]?.rows ?? [], error: '' },
    }));
    try {
      const result = await api.verificationMetricStores(metric, surveyorId, { limit: 500 });
      setVerificationMetricStoresByKey((current) => ({
        ...current,
        [cacheKey]: { loading: false, rows: result.stores, error: '' },
      }));
    } catch (error) {
      setVerificationMetricStoresByKey((current) => ({
        ...current,
        [cacheKey]: {
          loading: false,
          rows: current[cacheKey]?.rows ?? [],
          error: error instanceof Error ? error.message : 'List toko verifikasi gagal dimuat.',
        },
      }));
    }
  };

  const toggleVerificationMetricSurveyor = (metric: VerificationMetricKey, surveyorId: string) => {
    const cacheKey = verificationMetricStoreCacheKey(metric, surveyorId);
    const nextExpanded = !expandedVerificationMetricSurveyors[cacheKey];
    setExpandedVerificationMetricSurveyors((current) => ({ ...current, [cacheKey]: nextExpanded }));
    if (nextExpanded && !verificationMetricStoresByKey[cacheKey]) {
      loadVerificationMetricStores(metric, surveyorId);
    }
  };

  const loadVerificationHistoryStores = async (surveyorId: string) => {
    setVerificationHistoryStoresBySurveyor((current) => ({
      ...current,
      [surveyorId]: { loading: true, rows: current[surveyorId]?.rows ?? [], error: '' },
    }));
    try {
      const result = await api.verificationHistoryStores(surveyorId, { limit: 500 });
      setVerificationHistoryStoresBySurveyor((current) => ({
        ...current,
        [surveyorId]: { loading: false, rows: result.stores, error: '' },
      }));
    } catch (error) {
      setVerificationHistoryStoresBySurveyor((current) => ({
        ...current,
        [surveyorId]: {
          loading: false,
          rows: current[surveyorId]?.rows ?? [],
          error: error instanceof Error ? error.message : 'History toko verifikasi gagal dimuat.',
        },
      }));
    }
  };

  const toggleVerificationHistorySurveyor = (surveyorId: string) => {
    const nextExpanded = !expandedVerificationHistorySurveyors.includes(surveyorId);
    setExpandedVerificationHistorySurveyors((current) =>
      current.includes(surveyorId) ? current.filter((item) => item !== surveyorId) : [...current, surveyorId],
    );
    if (nextExpanded && !verificationHistoryStoresBySurveyor[surveyorId]) {
      loadVerificationHistoryStores(surveyorId);
    }
  };

  const pendingSurveyorGroups = verificationMetricGroupsByKey.pending ?? [];

  const clientStats = useMemo(
    () => ({
      pending: pendingSurveyorGroups.reduce((total, group) => total + group.count, 0),
      surveyors: pendingSurveyorGroups.length,
      warning: pendingSurveyorGroups.reduce((total, group) => total + group.warning, 0),
      duplicate: pendingSurveyorGroups.reduce((total, group) => total + group.duplicate, 0),
      missingPhoto: pendingSurveyorGroups.reduce((total, group) => total + group.missingPhoto, 0),
      gps: pendingSurveyorGroups.reduce((total, group) => total + group.gps, 0),
      oldest: pendingSurveyorGroups[0]?.oldestSubmitTime ? formatAge(pendingSurveyorGroups[0].oldestSubmitTime) : '-',
    }),
    [pendingSurveyorGroups],
  );
  const stats = useMemo(
    () =>
      verificationMetricSummary
        ? {
            pending: verificationMetricSummary.pending,
            surveyors: verificationMetricSummary.surveyors,
            warning: verificationMetricSummary.warning,
            duplicate: verificationMetricSummary.duplicate,
            missingPhoto: verificationMetricSummary.missingPhoto,
            gps: verificationMetricSummary.gps,
            oldest: verificationMetricSummary.oldestSubmitTime ? formatAge(verificationMetricSummary.oldestSubmitTime) : '-',
          }
        : clientStats,
    [clientStats, verificationMetricSummary],
  );

  const selected = rows.find((row) => row.id === reviewTargetId);
  const selectedIsVerificationHistory = selected ? verificationHistoryStatuses.includes(selected.verificationStatus) : false;

  useEffect(() => {
    setVerificationNotes(selected?.verificationNotes ?? '');
    setVerifierPhoneCallable(selected ? isVerifiedPhoneCallable(selected) : false);
    setVerifierWhatsappReachable(selected ? isVerifiedWaReachable(selected) : false);
    setRevisionRequest(selected?.revisionRequest ?? '');
    setRevisionAttempted(false);
  }, [
    selected?.id,
    selected?.verificationNotes,
    selected?.revisionRequest,
    selected?.whatsappNumber,
    selected?.verifierPhoneCallable,
    selected?.verifierWhatsappReachable,
    selected?.decisionMakerAvailability,
  ]);

  useEffect(() => {
    if (!selected || !duplicateDialogOpen) {
      setDuplicateCandidates([]);
      setLoadingDuplicateCandidates(false);
      return undefined;
    }

    const requestId = duplicateRequestIdRef.current + 1;
    duplicateRequestIdRef.current = requestId;
    setLoadingDuplicateCandidates(true);
    api
      .duplicateCandidates(selected.id, {
        search: duplicateSearch,
        limit: 10,
        minScore: duplicateOnlyHighConfidence ? DUPLICATE_WARNING_THRESHOLD : 25,
      })
      .then((result) => {
        if (duplicateRequestIdRef.current === requestId) setDuplicateCandidates(result.candidates);
      })
      .catch((error) => {
        if (duplicateRequestIdRef.current !== requestId) return;
        setDuplicateCandidates([]);
        setNotice({ message: error instanceof Error ? error.message : 'Kandidat duplikat gagal dimuat.', severity: 'error' });
      })
      .finally(() => {
        if (duplicateRequestIdRef.current === requestId) setLoadingDuplicateCandidates(false);
      });

    return undefined;
  }, [duplicateDialogOpen, duplicateOnlyHighConfidence, duplicateSearch, selected?.id]);

  const visibleDuplicateCandidates = duplicateCandidates;
  const duplicateTarget = duplicateTargetRow ?? rows.find((row) => row.id === duplicateTargetId && row.verificationStatus === 'VERIFIED_VALID');
  const duplicateTargetScore = selected && duplicateTarget ? duplicateCandidateScore(selected, duplicateTarget) : 0;
  const duplicateTargetMatch = selected && duplicateTarget ? duplicateMatchDetails(selected, duplicateTarget) : undefined;

  const openDuplicateDialog = (onlyHighConfidence = false) => {
    setDuplicateOnlyHighConfidence(onlyHighConfidence);
    setDuplicateTargetId('');
    setDuplicateTargetRow(null);
    setDuplicateSearch('');
    setDuplicateCandidates([]);
    setDuplicateCompareOpen(false);
    setDuplicateDialogOpen(true);
  };

  const openDuplicateCompare = (row: SurveyHistoryItem) => {
    setDuplicateTargetId(row.id);
    setDuplicateTargetRow(row);
    setDuplicateDialogOpen(false);
    setDuplicateCompareOpen(true);
  };

  const openReviewDialog = (row: SurveyHistoryItem) => {
    setReviewTargetId(row.id);
    setDuplicateDialogOpen(false);
    setDuplicateCompareOpen(false);
    setDuplicateTargetId('');
    setDuplicateTargetRow(null);
    setDuplicateSearch('');
    setDuplicateCandidates([]);
    setDuplicateOnlyHighConfidence(false);
    setRevisionAttempted(false);
    setRevisionDialogOpen(false);
    setVerificationNotes(row.verificationNotes ?? '');
    setVerifierPhoneCallable(isVerifiedPhoneCallable(row));
    setVerifierWhatsappReachable(isVerifiedWaReachable(row));
    setRevisionRequest(row.revisionRequest ?? '');
  };

  const openReviewFromVerificationMetric = (row: SurveyHistoryItem) => {
    setVerificationMetricDialog(null);
    setRows((currentRows) => {
      if (currentRows.some((item) => item.id === row.id)) return currentRows.map((item) => (item.id === row.id ? { ...item, ...row } : item));
      return [row, ...currentRows];
    });
    openReviewDialog(row);
    api
      .survey(row.id)
      .then((result) => {
        setRows((currentRows) => {
          if (currentRows.some((item) => item.id === result.survey.id)) {
            return currentRows.map((item) => (item.id === result.survey.id ? result.survey : item));
          }
          return [result.survey, ...currentRows];
        });
      })
      .catch(() => undefined);
  };

  const closeReviewDialog = () => {
    setReviewTargetId('');
    setDuplicateDialogOpen(false);
    setDuplicateCompareOpen(false);
    setDuplicateTargetId('');
    setDuplicateTargetRow(null);
    setDuplicateSearch('');
    setDuplicateCandidates([]);
    setDuplicateOnlyHighConfidence(false);
    setRevisionAttempted(false);
    setRevisionDialogOpen(false);
  };

  const closeDuplicateDialog = () => {
    setDuplicateDialogOpen(false);
    setDuplicateCompareOpen(false);
    setDuplicateTargetId('');
    setDuplicateTargetRow(null);
    setDuplicateSearch('');
    setDuplicateCandidates([]);
    setDuplicateOnlyHighConfidence(false);
  };

  const toggleSurveyorGroup = (surveyorId: string) => {
    const cacheKey = verificationMetricStoreCacheKey('pending', surveyorId);
    const nextExpanded = !expandedSurveyors.includes(surveyorId);
    setExpandedSurveyors((current) => (current.includes(surveyorId) ? current.filter((item) => item !== surveyorId) : [...current, surveyorId]));
    if (nextExpanded && !verificationMetricStoresByKey[cacheKey]) {
      loadVerificationMetricStores('pending', surveyorId);
    }
  };

  const decide = async (status: VerificationDecision, duplicateTargetRow?: SurveyHistoryItem) => {
    if (!selected) return;
    if (status === 'NEED_REVISION' && !revisionRequest.trim()) {
      setRevisionAttempted(true);
      setRevisionDialogOpen(true);
      setNotice({ message: 'Revision request wajib diisi sebelum mengirim Need Revision.', severity: 'warning' });
      return;
    }
    if (status === 'MERGED_DUPLICATE' && !duplicateTargetRow) {
      openDuplicateDialog(false);
      return;
    }

    setSavingDecision(true);
    try {
      const result = await api.verifySurvey(selected.id, {
        status,
        verificationNotes,
        revisionRequest: status === 'NEED_REVISION' ? revisionRequest : undefined,
        duplicateTargetId: duplicateTargetRow?.id,
        duplicateTargetStoreName: duplicateTargetRow?.storeName,
        verifierPhoneCallable,
        verifierWhatsappReachable,
      });
      setRows((currentRows) => currentRows.map((row) => (row.id === result.survey.id ? result.survey : row)));
      setVerificationMetricGroupsByKey({});
      setVerificationMetricTotalsByKey({});
      setVerificationMetricStoresByKey({});
      setVerificationHistoryStoresBySurveyor({});
      setExpandedSurveyors([]);
      setExpandedVerificationHistorySurveyors([]);
      void refreshVerificationMetricSummary();
      void loadPendingSurveyorGroups();
      void loadVerificationHistoryGroups();
      setNotice({ message: `${selected.storeName}: ${verificationDecisionLabels[status]}.`, severity: status === 'VERIFIED_VALID' ? 'success' : 'warning' });
      closeReviewDialog();
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Keputusan verifikasi gagal disimpan.', severity: 'error' });
    } finally {
      setSavingDecision(false);
    }
  };

  const openAnnulDialog = (row: SurveyHistoryItem) => {
    setAnnulTarget(row);
    setAnnulReason('');
  };

  const annulVerificationDecision = async () => {
    if (!annulTarget) return;
    setAnnullingVerification(true);
    try {
      const result = await api.annulVerification(annulTarget.id, { reason: annulReason });
      setRows((currentRows) => {
        if (currentRows.some((row) => row.id === result.survey.id)) {
          return currentRows.map((row) => (row.id === result.survey.id ? result.survey : row));
        }
        return [result.survey, ...currentRows];
      });
      setVerificationMetricGroupsByKey({});
      setVerificationMetricTotalsByKey({});
      setVerificationMetricStoresByKey({});
      setVerificationHistoryStoresBySurveyor({});
      setExpandedSurveyors([]);
      setExpandedVerificationHistorySurveyors([]);
      setAnnulTarget(null);
      setAnnulReason('');
      closeReviewDialog();
      void refreshVerificationMetricSummary();
      void loadPendingSurveyorGroups();
      void loadVerificationHistoryGroups();
      setNotice({
        message: `${annulTarget.storeName}: status verifikasi dianulir dan kembali ke antrean.`,
        severity: 'success',
      });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Status verifikasi gagal dianulir.', severity: 'error' });
    } finally {
      setAnnullingVerification(false);
    }
  };

  const renderQueueRow = (row: SurveyHistoryItem) => (
    <TableRow key={row.id} hover>
      <TableCell>
        <Stack spacing={0.7}>
          <Typography fontWeight={900} data-no-i18n>
            {row.storeName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.city} / {row.district} - {row.storeCode}
          </Typography>
          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={priorityLabel(row)} color={verificationPriority(row) === 1 ? 'warning' : 'default'} variant="outlined" />
            <Chip size="small" label={formatAge(row.submitTime)} color="info" variant="outlined" />
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
          <Chip size="small" label={`${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} variant="outlined" />
          <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
          {visibleVerificationWarningFlags(row).slice(0, 3).map((flag) => (
            <Chip key={flag} size="small" label={verificationWarningLabel(flag)} color="warning" variant="outlined" />
          ))}
        </Stack>
      </TableCell>
      <TableCell align="right">
        <Button size="small" variant="contained" startIcon={<FactCheckRoundedIcon />} onClick={() => openReviewFromVerificationMetric(row)}>
          Proses Verifikasi
        </Button>
      </TableCell>
    </TableRow>
  );

  const renderQueueCard = (row: SurveyHistoryItem) => (
    <Paper key={row.id} className="verification-card">
      <Stack spacing={1.2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0}>
            <Typography fontWeight={900} data-no-i18n>
              {row.storeName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.city} / {row.district} - {formatAge(row.submitTime)}
            </Typography>
          </Box>
          <Chip size="small" label={priorityLabel(row)} color={verificationPriority(row) === 1 ? 'warning' : 'default'} variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
          <Chip size="small" label={`${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} variant="outlined" />
          <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
        </Stack>
        <Button fullWidth variant="contained" startIcon={<FactCheckRoundedIcon />} onClick={() => openReviewFromVerificationMetric(row)}>
          Proses Verifikasi
        </Button>
      </Stack>
    </Paper>
  );

  const renderHistoryRow = (row: SurveyHistoryItem) => {
    const checkedAt = row.verifiedAt || row.updatedAt || row.verifierContactCheckedAt || row.submitTime;
    return (
      <TableRow key={row.id} hover>
        <TableCell>
          <Stack spacing={0.7}>
            <Typography fontWeight={900} data-no-i18n>
              {row.storeName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.city} / {row.district} - {row.storeCode}
            </Typography>
            <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={formatSubmittedAt(checkedAt)} color="info" variant="outlined" />
              {row.verificationNotes && <Chip size="small" label={t('Ada catatan')} variant="outlined" />}
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
            <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
            <Chip size="small" label={`${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} variant="outlined" />
            {visibleVerificationWarningFlags(row).slice(0, 2).map((flag) => (
              <Chip key={flag} size="small" label={verificationWarningLabel(flag)} color="warning" variant="outlined" />
            ))}
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" variant="outlined" startIcon={<VisibilityRoundedIcon />} onClick={() => openReviewFromVerificationMetric(row)}>
              {t('Detail')}
            </Button>
            <Button size="small" color="warning" variant="contained" startIcon={<RestartAltRoundedIcon />} onClick={() => openAnnulDialog(row)}>
              {t('Anulir')}
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const renderHistoryCard = (row: SurveyHistoryItem) => {
    const checkedAt = row.verifiedAt || row.updatedAt || row.verifierContactCheckedAt || row.submitTime;
    return (
      <Paper key={row.id} className="verification-card verification-history-store-card">
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Box minWidth={0}>
              <Typography fontWeight={900} data-no-i18n>
                {row.storeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.city} / {row.district} - {formatSubmittedAt(checkedAt)}
              </Typography>
            </Box>
            <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
            <Chip size="small" label={`${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} variant="outlined" />
            {row.verificationNotes && <Chip size="small" label={t('Ada catatan')} variant="outlined" />}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button fullWidth variant="outlined" startIcon={<VisibilityRoundedIcon />} onClick={() => openReviewFromVerificationMetric(row)}>
              {t('Detail')}
            </Button>
            <Button fullWidth color="warning" variant="contained" startIcon={<RestartAltRoundedIcon />} onClick={() => openAnnulDialog(row)}>
              {t('Anulir')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const activeVerificationMetricGroups = verificationMetricDialog ? verificationMetricGroupsByKey[verificationMetricDialog] ?? [] : [];
  const activeVerificationMetricTotal = verificationMetricDialog ? verificationMetricTotalsByKey[verificationMetricDialog] ?? 0 : 0;
  const metricCardValue = (value: number) => (verificationMetricSummary || verificationMetricSummaryError ? String(value) : '-');
  const metricOldestValue = verificationMetricSummary || verificationMetricSummaryError ? stats.oldest : '-';

  return (
    <Stack spacing={3}>
      <Box className="metric-grid verification-metrics">
        <ScoreBadge
          label={t('Belum Diverifikasi')}
          value={metricCardValue(stats.pending)}
          caption={`${t('Tertua')} ${metricOldestValue}`}
          tone={verificationMetricTone('pending')}
          detail={verificationMetricDescription('pending', language)}
          onOpen={() => openVerificationMetricDialog('pending')}
        />
        <ScoreBadge
          label={t('Surveyor Aktif')}
          value={metricCardValue(stats.surveyors)}
          caption={t('Memiliki antrean terbuka')}
          tone={verificationMetricTone('surveyors')}
          detail={verificationMetricDescription('surveyors', language)}
          onOpen={() => openVerificationMetricDialog('surveyors')}
        />
        <ScoreBadge
          label={t('Warning Queue')}
          value={metricCardValue(stats.warning)}
          caption={t('Prioritas pertama PRD')}
          tone={verificationMetricTone('warning')}
          detail={verificationMetricDescription('warning', language)}
          onOpen={() => openVerificationMetricDialog('warning')}
        />
        <ScoreBadge
          label={t('GPS Warning')}
          value={metricCardValue(stats.gps)}
          caption={t('Perlu cek koordinat')}
          tone={verificationMetricTone('gps')}
          detail={verificationMetricDescription('gps', language)}
          onOpen={() => openVerificationMetricDialog('gps')}
        />
        <ScoreBadge
          label={t('Missing Photo')}
          value={metricCardValue(stats.missingPhoto)}
          caption={t('Evidence perlu review')}
          tone={verificationMetricTone('missingPhoto')}
          detail={verificationMetricDescription('missingPhoto', language)}
          onOpen={() => openVerificationMetricDialog('missingPhoto')}
        />
        <ScoreBadge
          label={t('Duplicate')}
          value={metricCardValue(stats.duplicate)}
          caption={t('Candidate merge')}
          tone={verificationMetricTone('duplicate')}
          detail={verificationMetricDescription('duplicate', language)}
          onOpen={() => openVerificationMetricDialog('duplicate')}
        />
      </Box>
      {verificationMetricSummaryError && (
        <Alert severity="warning">
          {verificationMetricSummaryError} {t('Angka kartu sementara memakai data antrean yang sudah termuat di halaman.')}
        </Alert>
      )}

      <Dialog open={Boolean(verificationMetricDialog)} onClose={() => setVerificationMetricDialog(null)} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box minWidth={0}>
              <Typography variant="h6">
                {verificationMetricDialog ? verificationMetricTitle(verificationMetricDialog, language) : t('Drill-down metrik')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {verificationMetricDialog ? verificationMetricDescription(verificationMetricDialog, language) : ''}
              </Typography>
            </Box>
            {verificationMetricDialog && (
              <Chip
                size="small"
                label={verificationMetricTotalLabel(verificationMetricDialog, activeVerificationMetricTotal, language)}
                sx={{ bgcolor: alpha(verificationMetricTone(verificationMetricDialog), 0.14), color: verificationMetricTone(verificationMetricDialog) }}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.2}>
            {verificationMetricGroupsLoading && <LinearProgress />}
            {verificationMetricGroupsError && <Alert severity="error">{verificationMetricGroupsError}</Alert>}
            {!verificationMetricGroupsLoading && !verificationMetricGroupsError && activeVerificationMetricGroups.length === 0 && (
              <Paper className="history-empty-card">
                <Typography fontWeight={900}>{t('Tidak ada toko untuk metrik ini.')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Data akan muncul saat ada antrean verifikasi yang memenuhi kriteria metrik.')}
                </Typography>
              </Paper>
            )}
            {verificationMetricDialog &&
              activeVerificationMetricGroups.map((group) => {
                const cacheKey = verificationMetricStoreCacheKey(verificationMetricDialog, group.surveyorId);
                const expanded = Boolean(expandedVerificationMetricSurveyors[cacheKey]);
                const storeState = verificationMetricStoresByKey[cacheKey];
                return (
                  <Paper key={group.surveyorId} className="metric-drilldown-group">
                    <Button className="metric-drilldown-toggle" fullWidth onClick={() => toggleVerificationMetricSurveyor(verificationMetricDialog, group.surveyorId)}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ xs: 'stretch', md: 'center' }} width="100%">
                        <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0} flex={1}>
                          {expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                          <Avatar>{group.surveyorName.slice(0, 1)}</Avatar>
                          <Box minWidth={0} textAlign="left">
                            <Typography fontWeight={900} data-no-i18n>
                              {group.surveyorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.managerName || t('Manager belum terisi')} - {t('tertua')}{' '}
                              {group.oldestSubmitTime ? formatAge(group.oldestSubmitTime) : '-'}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                          <Chip size="small" label={`${group.count} ${t('toko')}`} color="primary" />
                          <Chip size="small" label={`${t('Warning')} ${group.warning}`} color={group.warning ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`GPS ${group.gps}`} color={group.gps ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${t('Foto')} ${group.missingPhoto}`} color={group.missingPhoto ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${t('Duplikat')} ${group.duplicate}`} color={group.duplicate ? 'error' : 'default'} variant="outlined" />
                          <Chip size="small" label={`Hot ${group.hot}`} color={group.hot ? 'secondary' : 'default'} variant="outlined" />
                          <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                        </Stack>
                      </Stack>
                    </Button>
                    {expanded && (
                      <Box className="metric-drilldown-store-panel">
                        {storeState?.loading && <LinearProgress />}
                        {storeState?.error && <Alert severity="error">{storeState.error}</Alert>}
                        {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {t('Tidak ada toko pada grup ini.')}
                          </Typography>
                        )}
                        <Stack spacing={1}>
                          {(storeState?.rows ?? []).map((row) => (
                            <Paper
                              key={row.id}
                              className="metric-drilldown-store"
                              role="button"
                              tabIndex={0}
                              onClick={() => openReviewFromVerificationMetric(row)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  openReviewFromVerificationMetric(row);
                                }
                              }}
                            >
                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                                <Box minWidth={0}>
                                  <Typography fontWeight={900} data-no-i18n>
                                    {row.storeName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.city} / {row.district} / {row.village} - {formatAge(row.submitTime)}
                                  </Typography>
                                </Box>
                                <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                  <Chip size="small" label={priorityLabel(row)} color={verificationPriority(row) === 1 ? 'warning' : 'default'} variant="outlined" />
                                  <Chip size="small" label={leadClassificationLabel(row.leadClassification, language)} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
                                  <Chip size="small" label={`DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} color="info" variant="outlined" />
                                  {hasDuplicateWarning(row) && <Chip size="small" label={`${t('Duplikat')} ${row.duplicateCandidateCount}`} color="error" variant="outlined" />}
                                  {hasMissingPhoto(row) && <Chip size="small" label={t('Foto perlu review')} color="warning" variant="outlined" />}
                                  <Button
                                    size="small"
                                    variant="contained"
                                    className="metric-drilldown-action"
                                    startIcon={<FactCheckRoundedIcon />}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openReviewFromVerificationMetric(row);
                                    }}
                                  >
                                    {t('Proses Verifikasi')}
                                  </Button>
                                </Stack>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                );
              })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationMetricDialog(null)}>{t('Tutup')}</Button>
          {verificationMetricDialog && (
            <Button variant="outlined" onClick={() => loadVerificationMetricGroups(verificationMetricDialog)} disabled={verificationMetricGroupsLoading}>
              Refresh
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Paper className="section-panel wide">
        <SectionTitle
          icon={<FactCheckRoundedIcon />}
          title={t('Antrean Belum Diverifikasi')}
          action={<Chip icon={<WarningAmberRoundedIcon />} label={`${stats.pending} ${t('toko')}`} color="warning" />}
        />
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <Table size="small" className="verification-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Surveyor / Store')}</TableCell>
                  <TableCell>{t('Agregasi')}</TableCell>
                  <TableCell align="right">{t('Aksi')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingSurveyorGroups.length ? (
                  pendingSurveyorGroups.map((group) => {
                    const expanded = expandedSurveyors.includes(group.surveyorId);
                    const oldest = group.oldestSubmitTime ? formatAge(group.oldestSubmitTime) : '-';
                    const cacheKey = verificationMetricStoreCacheKey('pending', group.surveyorId);
                    const storeState = verificationMetricStoresByKey[cacheKey];
                    return (
                      <Fragment key={group.surveyorId}>
                        <TableRow hover selected={expanded} sx={{ cursor: 'pointer' }} onClick={() => toggleSurveyorGroup(group.surveyorId)}>
                          <TableCell colSpan={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5}>
                              <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  <BadgeRoundedIcon />
                                </Avatar>
                                <Box minWidth={0}>
                                  <Typography fontWeight={900}>{group.surveyorName}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {group.count} {t('toko belum diverifikasi')} - {t('umur tertua')} {oldest}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Chip size="small" label={`${t('Warning')} ${group.warning}`} color={group.warning ? 'warning' : 'default'} variant="outlined" />
                                <Chip size="small" label={`GPS ${group.gps}`} color={group.gps ? 'warning' : 'default'} variant="outlined" />
                                <Chip size="small" label={`${t('Foto')} ${group.missingPhoto}`} color={group.missingPhoto ? 'warning' : 'default'} variant="outlined" />
                                <Chip size="small" label={`${t('Duplikat')} ${group.duplicate}`} color={group.duplicate ? 'error' : 'default'} variant="outlined" />
                                <Chip size="small" label={`Hot ${group.hot}`} color={group.hot ? 'secondary' : 'default'} variant="outlined" />
                                <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                                <Button size="small" variant="text" endIcon={expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}>
                                  {expanded ? t('Collapse') : t('Expand')}
                                </Button>
                              </Stack>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {expanded && (
                          <>
                            {storeState?.loading && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <LinearProgress />
                                </TableCell>
                              </TableRow>
                            )}
                            {storeState?.error && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Alert severity="error">{storeState.error}</Alert>
                                </TableCell>
                              </TableRow>
                            )}
                            {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Typography color="text.secondary">{t('Tidak ada toko pada grup ini.')}</Typography>
                                </TableCell>
                              </TableRow>
                            )}
                            {(storeState?.rows ?? []).map(renderQueueRow)}
                          </>
                        )}
                      </Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography color="text.secondary">{t('Tidak ada antrean verifikasi terbuka.')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Stack spacing={1.2} className="verification-card-list">
              {pendingSurveyorGroups.length ? (
                pendingSurveyorGroups.map((group) => {
                  const expanded = expandedSurveyors.includes(group.surveyorId);
                  const oldest = group.oldestSubmitTime ? formatAge(group.oldestSubmitTime) : '-';
                  const cacheKey = verificationMetricStoreCacheKey('pending', group.surveyorId);
                  const storeState = verificationMetricStoresByKey[cacheKey];
                  return (
                    <Paper key={group.surveyorId} className="verification-card">
                      <Stack spacing={1.2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                          <Box minWidth={0}>
                            <Typography fontWeight={900}>{group.surveyorName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.count} {t('toko')} - {t('tertua')} {oldest}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => toggleSurveyorGroup(group.surveyorId)} aria-label={expanded ? t('Collapse') : t('Expand')}>
                            {expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                          </IconButton>
                        </Stack>
                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                          <Chip size="small" label={`${t('Warning')} ${group.warning}`} color={group.warning ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${t('Duplikat')} ${group.duplicate}`} color={group.duplicate ? 'error' : 'default'} variant="outlined" />
                          <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                        </Stack>
                        {expanded && (
                          <Stack spacing={1}>
                            {storeState?.loading && <LinearProgress />}
                            {storeState?.error && <Alert severity="error">{storeState.error}</Alert>}
                            {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                              <Typography color="text.secondary">{t('Tidak ada toko pada grup ini.')}</Typography>
                            )}
                            {(storeState?.rows ?? []).map(renderQueueCard)}
                          </Stack>
                        )}
                      </Stack>
                    </Paper>
                  );
                })
              ) : (
                <Typography color="text.secondary">{t('Tidak ada antrean verifikasi terbuka.')}</Typography>
              )}
            </Stack>
          </>
        )}
      </Paper>

      <Paper className="section-panel wide verification-history-section">
        <SectionTitle
          icon={<HistoryRoundedIcon />}
          title={t('History Verifikasi')}
          action={<Chip icon={<FactCheckRoundedIcon />} label={`${verificationHistoryTotal} ${t('data')}`} color="success" variant="outlined" />}
        />
        <Alert severity="info" variant="outlined" className="verification-history-alert">
          {localCopy(language, {
            id: 'History ini berisi data yang sudah mendapat keputusan verifikator. Jika keputusan salah, anulir status agar data kembali masuk antrean verifikasi.',
            en: 'This history contains data that already has a verifier decision. If a decision is wrong, annul the status so the data returns to the verification queue.',
            zh: '此历史记录包含已有审核决定的数据。如决定有误，可撤销状态，使数据返回审核队列。',
          })}
        </Alert>
        {verificationHistoryLoading ? (
          <LinearProgress />
        ) : verificationHistoryError ? (
          <Alert severity="error">{verificationHistoryError}</Alert>
        ) : (
          <>
            <Table size="small" className="verification-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Surveyor / Store')}</TableCell>
                  <TableCell>{t('Agregasi')}</TableCell>
                  <TableCell align="right">{t('Aksi')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verificationHistoryGroups.length ? (
                  verificationHistoryGroups.map((group) => {
                    const expanded = expandedVerificationHistorySurveyors.includes(group.surveyorId);
                    const storeState = verificationHistoryStoresBySurveyor[group.surveyorId];
                    return (
                      <Fragment key={group.surveyorId}>
                        <TableRow hover selected={expanded} sx={{ cursor: 'pointer' }} onClick={() => toggleVerificationHistorySurveyor(group.surveyorId)}>
                          <TableCell colSpan={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={1.5}>
                              <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0}>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                  <HistoryRoundedIcon />
                                </Avatar>
                                <Box minWidth={0}>
                                  <Typography fontWeight={900}>{group.surveyorName}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {group.count} {t('data sudah diverifikasi')} - {t('terbaru')} {group.latestVerifiedAt ? formatSubmittedAt(group.latestVerifiedAt) : '-'}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Chip size="small" label={`${t('Valid')} ${group.verified}`} color={group.verified ? 'success' : 'default'} variant="outlined" />
                                <Chip size="small" label={`${t('Revisi')} ${group.needRevision}`} color={group.needRevision ? 'warning' : 'default'} variant="outlined" />
                                <Chip size="small" label={`${t('Ditolak')} ${group.rejected}`} color={group.rejected ? 'error' : 'default'} variant="outlined" />
                                <Chip size="small" label={`${t('Duplikat')} ${group.mergedDuplicate}`} color={group.mergedDuplicate ? 'info' : 'default'} variant="outlined" />
                                <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                                <Button size="small" variant="text" endIcon={expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}>
                                  {expanded ? t('Collapse') : t('Expand')}
                                </Button>
                              </Stack>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {expanded && (
                          <>
                            {storeState?.loading && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <LinearProgress />
                                </TableCell>
                              </TableRow>
                            )}
                            {storeState?.error && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Alert severity="error">{storeState.error}</Alert>
                                </TableCell>
                              </TableRow>
                            )}
                            {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Typography color="text.secondary">{t('Tidak ada history pada grup ini.')}</Typography>
                                </TableCell>
                              </TableRow>
                            )}
                            {(storeState?.rows ?? []).map(renderHistoryRow)}
                          </>
                        )}
                      </Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography color="text.secondary">{t('Belum ada history verifikasi.')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Stack spacing={1.2} className="verification-card-list">
              {verificationHistoryGroups.length ? (
                verificationHistoryGroups.map((group) => {
                  const expanded = expandedVerificationHistorySurveyors.includes(group.surveyorId);
                  const storeState = verificationHistoryStoresBySurveyor[group.surveyorId];
                  return (
                    <Paper key={group.surveyorId} className="verification-card verification-history-group-card">
                      <Stack spacing={1.2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                          <Box minWidth={0}>
                            <Typography fontWeight={900}>{group.surveyorName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.count} {t('data')} - {t('terbaru')} {group.latestVerifiedAt ? formatSubmittedAt(group.latestVerifiedAt) : '-'}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => toggleVerificationHistorySurveyor(group.surveyorId)}
                            aria-label={expanded ? t('Collapse') : t('Expand')}
                          >
                            {expanded ? <KeyboardArrowDownRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                          </IconButton>
                        </Stack>
                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                          <Chip size="small" label={`${t('Valid')} ${group.verified}`} color={group.verified ? 'success' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${t('Revisi')} ${group.needRevision}`} color={group.needRevision ? 'warning' : 'default'} variant="outlined" />
                          <Chip size="small" label={`${t('Ditolak')} ${group.rejected}`} color={group.rejected ? 'error' : 'default'} variant="outlined" />
                          <Chip size="small" label={`Avg DQ ${group.avgQuality}`} color="info" variant="outlined" />
                        </Stack>
                        {expanded && (
                          <Stack spacing={1}>
                            {storeState?.loading && <LinearProgress />}
                            {storeState?.error && <Alert severity="error">{storeState.error}</Alert>}
                            {!storeState?.loading && !storeState?.error && storeState?.rows.length === 0 && (
                              <Typography color="text.secondary">{t('Tidak ada history pada grup ini.')}</Typography>
                            )}
                            {(storeState?.rows ?? []).map(renderHistoryCard)}
                          </Stack>
                        )}
                      </Stack>
                    </Paper>
                  );
                })
              ) : (
                <Typography color="text.secondary">{t('Belum ada history verifikasi.')}</Typography>
              )}
            </Stack>
          </>
        )}
      </Paper>

      <Dialog open={Boolean(selected)} onClose={() => !savingDecision && closeReviewDialog()} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box minWidth={0}>
              <Typography variant="h6">{t('Verification Detail')}</Typography>
              <Typography variant="body2" color="text.secondary" data-no-i18n>
                {selected ? `${selected.storeName} - ${selected.surveyorName}` : ''}
              </Typography>
            </Box>
            <IconButton onClick={closeReviewDialog} disabled={savingDecision} aria-label={t('Tutup')}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: 'primary.main' }}>
                  <StorefrontRoundedIcon />
                </Avatar>
                <Box minWidth={0}>
                  <Typography fontWeight={900} data-no-i18n>
                    {selected.storeName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selected.storeCode} - {selected.surveyorName}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={verificationStatusLabel(selected.verificationStatus, language)} color={statusChipColor(selected.verificationStatus)} />
                <Chip size="small" label={leadClassificationLabel(selected.leadClassification, language)} color={isHotOrQualified(selected) ? 'secondary' : 'primary'} variant="outlined" />
                <Chip size="small" label={`${selected.merchantGrade} / ${selected.merchantPotentialScore}`} variant="outlined" />
                <Chip size="small" label={`${dataQualityGradeLabel(selected.dataQualityGrade, language)} / ${selected.dataQualityScore}`} variant="outlined" />
              </Stack>

              {(selected.duplicateCandidateCount ?? 0) > 0 && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  icon={<WarningAmberRoundedIcon />}
                  className="duplicate-warning-alert"
                  role="button"
                  tabIndex={0}
                  action={
                    <Button color="warning" size="small" onClick={() => openDuplicateDialog(true)}>
                      {localCopy(language, { id: 'Lihat kandidat', en: 'View candidates', zh: '查看候选' })}
                    </Button>
                  }
                  onClick={() => openDuplicateDialog(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openDuplicateDialog(true);
                    }
                  }}
                >
                  {localCopy(language, {
                    id: `Ada ${selected.duplicateCandidateCount} toko terverifikasi dengan skor minimal ${DUPLICATE_WARNING_THRESHOLD}%. Kecocokan tertinggi ${selected.duplicateTopScore}%.`,
                    en: `${selected.duplicateCandidateCount} verified store(s) match this submission at ${DUPLICATE_WARNING_THRESHOLD}% or above. Highest match ${selected.duplicateTopScore}%.`,
                    zh: `发现 ${selected.duplicateCandidateCount} 个已验证门店与本次提交的匹配度达到 ${DUPLICATE_WARNING_THRESHOLD}% 或以上。最高匹配度 ${selected.duplicateTopScore}%。`,
                  })}
                </Alert>
              )}

              <SurveyPhotoEvidenceGrid survey={selected} />

              <Stack spacing={1}>
                <ContactActionRow row={selected} />
                <ContactVerificationChecklist
                  row={selected}
                  phoneCallable={verifierPhoneCallable}
                  whatsappReachable={verifierWhatsappReachable}
                  onPhoneCallableChange={setVerifierPhoneCallable}
                  onWhatsappReachableChange={setVerifierWhatsappReachable}
                  readOnly={selectedIsVerificationHistory}
                />
                <VerificationLocationReviewCard row={selected} />
                <ReviewCheck
                  label={t('Photo Evidence')}
                  value={hasMissingPhoto(selected) ? selected.photoMissingReason || 'Ada evidence yang belum lengkap' : 'Front, rack, dan PIC tersedia'}
                  state={hasMissingPhoto(selected) ? 'warning' : 'ok'}
                />
                <ReviewCheck
                  label={t('Duplicate')}
                  value={
                    hasDuplicateWarning(selected)
                      ? `${selected.duplicateCandidateCount} kandidat merge, skor tertinggi ${selected.duplicateTopScore}%`
                      : 'Belum ada kandidat merge valid'
                  }
                  state={hasDuplicateWarning(selected) ? 'warning' : 'ok'}
                />
                <ReviewCheck
                  label={t('Cooling vs Supplier')}
                  value={`${selected.coolingProducts.join(', ') || '-'} / ${selected.supplierName}`}
                  state={selected.coolingProducts.length && selected.supplierName ? 'ok' : 'warning'}
                />
                <ReviewCheck
                  label={t('WA Rule')}
                  value={
                    selected.whatsappNumber
                      ? verifierWhatsappReachable
                        ? 'WA terverifikasi reachable, eligible Hot Lead jika score tinggi'
                        : 'Nomor ada, tetapi WhatsApp ditandai tidak reachable'
                      : selected.waEmptyReason || 'WA kosong tanpa alasan'
                  }
                  state={(selected.whatsappNumber && verifierWhatsappReachable) || (!selected.whatsappNumber && selected.waEmptyReason) ? 'ok' : 'warning'}
                />
                <ReviewCheck
                  label="Telepon"
                  value={selected.whatsappNumber ? (verifierPhoneCallable ? 'Nomor bisa ditelepon' : 'Nomor tidak bisa ditelepon') : 'Tidak ada nomor customer'}
                  state={selected.whatsappNumber && verifierPhoneCallable ? 'ok' : 'warning'}
                />
              </Stack>

              <TextField
                label={t('Verification notes')}
                value={verificationNotes}
                onChange={(event) => setVerificationNotes(event.target.value)}
                disabled={selectedIsVerificationHistory}
                multiline
                minRows={2}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={closeReviewDialog} disabled={savingDecision}>
            {t('Cancel')}
          </Button>
          {selected && selectedIsVerificationHistory ? (
            <Button variant="contained" color="warning" startIcon={<RestartAltRoundedIcon />} disabled={savingDecision} onClick={() => openAnnulDialog(selected)}>
              {t('Anulir Status Verifikasi')}
            </Button>
          ) : (
            <>
              <Button variant="outlined" color="error" startIcon={<WarningAmberRoundedIcon />} disabled={savingDecision} onClick={() => decide('REJECTED_INVALID')}>
                Reject Invalid
              </Button>
              <Button variant="outlined" startIcon={<PublishedWithChangesRoundedIcon />} disabled={savingDecision} onClick={() => decide('MERGED_DUPLICATE')}>
                Merge Duplicate
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<SyncProblemRoundedIcon />}
                disabled={savingDecision}
                onClick={() => {
                  setRevisionAttempted(false);
                  setRevisionDialogOpen(true);
                }}
              >
                Need Revision
              </Button>
              <Button variant="contained" color="success" startIcon={<CheckCircleRoundedIcon />} disabled={savingDecision} onClick={() => decide('VERIFIED_VALID')}>
                Verified Valid
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(annulTarget)}
        onClose={() => {
          if (!annullingVerification) {
            setAnnulTarget(null);
            setAnnulReason('');
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('Anulir Status Verifikasi')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Alert severity="warning" variant="outlined">
              {annulTarget
                ? localCopy(language, {
                    id: `${annulTarget.storeName} akan dikembalikan ke antrean belum diverifikasi. Catatan keputusan, status valid/revisi/tolak/duplikat, dan checklist kontak verifikator akan dibersihkan.`,
                    en: `${annulTarget.storeName} will return to the unverified queue. Decision notes, valid/revision/rejected/duplicate status, and verifier contact checks will be cleared.`,
                    zh: `${annulTarget.storeName} 将返回未审核队列。审核备注、有效/修订/驳回/重复状态以及审核员联系检查将被清除。`,
                  })
                : ''}
            </Alert>
            <TextField
              label={localCopy(language, { id: 'Alasan anulir (opsional)', en: 'Annul reason (optional)', zh: '撤销原因（可选）' })}
              value={annulReason}
              onChange={(event) => setAnnulReason(event.target.value)}
              placeholder={localCopy(language, {
                id: 'Contoh: keputusan valid salah, perlu review ulang oleh verifikator.',
                en: 'Example: valid decision was incorrect, needs verifier review again.',
                zh: '示例：有效判定有误，需要审核员重新复核。',
              })}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            onClick={() => {
              setAnnulTarget(null);
              setAnnulReason('');
            }}
            disabled={annullingVerification}
          >
            {t('Batal')}
          </Button>
          <Button variant="contained" color="warning" startIcon={<RestartAltRoundedIcon />} disabled={annullingVerification} onClick={annulVerificationDecision}>
            {annullingVerification ? t('Memproses...') : t('Anulir dan kembalikan ke antrean')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={revisionDialogOpen && Boolean(selected)}
        onClose={() => {
          if (!savingDecision) {
            setRevisionDialogOpen(false);
            setRevisionAttempted(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('Kembalikan data ke surveyor')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <DialogContentText>
              Jelaskan bagian yang perlu diperbaiki. Catatan ini akan dikirim ke surveyor sebagai instruksi revisi.
            </DialogContentText>
            <TextField
              autoFocus
              required
              label={t('Revision request')}
              value={revisionRequest}
              onChange={(event) => {
                setRevisionRequest(event.target.value);
                if (event.target.value.trim()) setRevisionAttempted(false);
              }}
              placeholder="Contoh: Lengkapi foto PIC, cek ulang koordinat toko, dan konfirmasi nomor customer."
              helperText={revisionAttempted && !revisionRequest.trim() ? t('Revision request wajib diisi untuk Need Revision.') : 'Instruksi ini akan muncul di form revisi surveyor.'}
              error={revisionAttempted && !revisionRequest.trim()}
              multiline
              minRows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            onClick={() => {
              setRevisionDialogOpen(false);
              setRevisionAttempted(false);
            }}
            disabled={savingDecision}
          >
            Batal
          </Button>
          <Button variant="contained" color="warning" startIcon={<SyncProblemRoundedIcon />} disabled={savingDecision} onClick={() => decide('NEED_REVISION')}>
            Kembalikan data ke surveyor
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={duplicateDialogOpen} onClose={() => !savingDecision && closeDuplicateDialog()} fullWidth maxWidth="md">
        <DialogTitle>
          {duplicateOnlyHighConfidence
            ? localCopy(language, { id: 'Warning Kandidat Duplikat', en: 'Duplicate Warning Candidates', zh: '重复预警候选' })
            : t('Pilih Toko Duplikat')}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5} className="duplicate-picker-toolbar">
            <DialogContentText>
              {duplicateOnlyHighConfidence
                ? localCopy(language, {
                    id: `Menampilkan toko terverifikasi dengan skor kecocokan minimal ${DUPLICATE_WARNING_THRESHOLD}%.`,
                    en: `Showing verified stores with a match score of at least ${DUPLICATE_WARNING_THRESHOLD}%.`,
                    zh: `显示匹配度至少为 ${DUPLICATE_WARNING_THRESHOLD}% 的已验证门店。`,
                  })
                : localCopy(language, {
                    id: 'Menampilkan 10 besar toko terverifikasi yang memiliki kecocokan data dengan toko yang sedang direview.',
                    en: 'Showing the top 10 verified stores with matching data against the store under review.',
                    zh: '\u663e\u793a\u4e0e\u5f53\u524d\u5ba1\u6838\u95e8\u5e97\u6570\u636e\u5339\u914d\u7684\u524d 10 \u4e2a\u5df2\u9a8c\u8bc1\u95e8\u5e97\u3002',
                  })}
            </DialogContentText>
            <TextField
              value={duplicateSearch}
              onChange={(event) => setDuplicateSearch(event.target.value)}
              label={localCopy(language, { id: 'Cari toko terverifikasi', en: 'Search verified stores', zh: '\u641c\u7d22\u5df2\u9a8c\u8bc1\u95e8\u5e97' })}
              placeholder={localCopy(language, { id: 'Nama toko, kode, kota, kecamatan, WA', en: 'Store name, code, city, district, WA', zh: '\u95e8\u5e97\u540d\u79f0\u3001\u7f16\u7801\u3001\u57ce\u5e02\u3001\u533a\u53bf\u3001WhatsApp' })}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack spacing={1} className="duplicate-candidate-list">
            {loadingDuplicateCandidates ? (
              <LinearProgress />
            ) : visibleDuplicateCandidates.length ? (
              visibleDuplicateCandidates.map(({ row, score }) => {
                const matchDetails = selected ? duplicateMatchDetails(selected, row) : undefined;
                const matchedSignals = matchDetails?.signals.filter((signal) => signal.matched) ?? [];
                return (
                  <Paper
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    className={`verification-card duplicate-candidate-card ${duplicateTargetId === row.id ? 'active' : ''}`}
                    onClick={() => openDuplicateCompare(row)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openDuplicateCompare(row);
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                      <Box minWidth={0}>
                        <Typography fontWeight={900} data-no-i18n>
                          {row.storeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.city} / {row.district} - {row.storeCode}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={`${score}%`}
                        color={score >= DUPLICATE_WARNING_THRESHOLD ? 'success' : score >= 45 ? 'warning' : 'info'}
                        variant="outlined"
                        reason={duplicateScoreReason(language)}
                      />
                    </Stack>
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      <Chip size="small" label={verificationStatusLabel(row.verificationStatus, language)} color={statusChipColor(row.verificationStatus)} variant="outlined" />
                      <Chip size="small" label={`${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}`} variant="outlined" />
                      <Chip size="small" label={row.whatsappNumber || t('WA kosong')} variant="outlined" />
                      {matchedSignals.slice(0, 4).map((signal) => (
                        <Chip key={signal.key} size="small" label={`${duplicateSignalLabel(signal.key, language)} +${signal.weight}%`} color="success" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>
                );
              })
            ) : (
              <Typography color="text.secondary">
                {localCopy(language, {
                  id: duplicateOnlyHighConfidence
                    ? `Tidak ada toko terverifikasi dengan skor kecocokan minimal ${DUPLICATE_WARNING_THRESHOLD}%.`
                    : 'Tidak ada toko terverifikasi dengan data yang cocok.',
                  en: duplicateOnlyHighConfidence
                    ? `No verified store reaches a ${DUPLICATE_WARNING_THRESHOLD}% match score.`
                    : 'No verified store has matching data.',
                  zh: duplicateOnlyHighConfidence
                    ? `没有已验证门店达到 ${DUPLICATE_WARNING_THRESHOLD}% 的匹配度。`
                    : '\u6ca1\u6709\u5df2\u9a8c\u8bc1\u95e8\u5e97\u5177\u6709\u5339\u914d\u6570\u636e\u3002',
                })}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDuplicateDialog} disabled={savingDecision}>
            {localCopy(language, { id: 'Tutup', en: 'Close', zh: '\u5173\u95ed' })}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={duplicateCompareOpen && Boolean(selected && duplicateTarget)} onClose={() => !savingDecision && setDuplicateCompareOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
            <Box minWidth={0}>
              <Typography variant="h6">
                {localCopy(language, { id: 'Bandingkan Toko Duplikat', en: 'Compare Duplicate Stores', zh: '\u5bf9\u6bd4\u91cd\u590d\u95e8\u5e97' })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('Match')} {duplicateTargetScore}%
              </Typography>
            </Box>
            <IconButton onClick={() => setDuplicateCompareOpen(false)} disabled={savingDecision} aria-label={localCopy(language, { id: 'Tutup', en: 'Close', zh: '\u5173\u95ed' })}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selected && duplicateTarget && (
            <Stack spacing={2}>
              {duplicateTargetMatch && (
                <Paper className="duplicate-match-summary">
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                    <Stack spacing={0.4} minWidth={0}>
                      <Typography fontWeight={900}>
                        {localCopy(language, { id: 'Skor kecocokan', en: 'Match score', zh: '匹配度' })} {duplicateTargetMatch.percentage}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {localCopy(language, {
                          id: 'Sistem menilai persentase dari bobot nama toko, nomor WhatsApp, lokasi administratif, alamat, dan kedekatan koordinat.',
                          en: 'The system calculates the percentage from weighted store-name, WhatsApp, administrative location, address, and coordinate proximity signals.',
                          zh: '系统根据门店名称、WhatsApp、行政区域、地址和坐标距离的加权信号计算匹配百分比。',
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                      {duplicateTargetMatch.signals
                        .filter((signal) => signal.matched)
                        .map((signal) => (
                          <Chip key={signal.key} size="small" label={`${duplicateSignalLabel(signal.key, language)} +${signal.weight}%`} color="success" variant="outlined" />
                        ))}
                    </Stack>
                  </Stack>
                </Paper>
              )}
              <Box className="duplicate-compare-grid">
                <DuplicateStoreCompareCard
                  title={localCopy(language, { id: 'Toko Awal', en: 'Original Store', zh: '\u539f\u59cb\u95e8\u5e97' })}
                  row={selected}
                  counterpart={duplicateTarget}
                  statusColor="warning"
                  matchDetails={duplicateTargetMatch}
                />
                <DuplicateStoreCompareCard
                  title={localCopy(language, { id: 'Kandidat Toko Terverifikasi', en: 'Verified Store Candidate', zh: '\u5df2\u9a8c\u8bc1\u95e8\u5e97\u5019\u9009' })}
                  row={duplicateTarget}
                  counterpart={selected}
                  statusColor="success"
                  matchScore={duplicateTargetScore}
                  matchDetails={duplicateTargetMatch}
                />
              </Box>
              <Paper className="duplicate-compare-note">
                <Typography variant="body2" color="text.secondary">
                  {localCopy(language, {
                    id: 'Keputusan ini akan menandai toko awal sebagai duplikat dari kandidat terverifikasi yang dipilih. Data kandidat di kanan tetap menjadi master store.',
                    en: 'This decision marks the original store as a duplicate of the selected verified candidate. The candidate on the right remains the master store.',
                    zh: '\u6b64\u51b3\u5b9a\u4f1a\u5c06\u539f\u59cb\u95e8\u5e97\u6807\u8bb0\u4e3a\u6240\u9009\u5df2\u9a8c\u8bc1\u95e8\u5e97\u7684\u91cd\u590d\u8bb0\u5f55\u3002\u53f3\u4fa7\u95e8\u5e97\u5c06\u4fdd\u7559\u4e3a\u4e3b\u95e8\u5e97\u3002',
                  })}
                </Typography>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => setDuplicateCompareOpen(false)} disabled={savingDecision}>
            {localCopy(language, { id: 'Tutup', en: 'Close', zh: '\u5173\u95ed' })}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PublishedWithChangesRoundedIcon />}
            disabled={!duplicateTarget || savingDecision}
            onClick={() => duplicateTarget && decide('MERGED_DUPLICATE', duplicateTarget)}
          >
            {localCopy(language, { id: 'Tandai Toko Sebagai Duplikat', en: 'Mark Store as Duplicate', zh: '\u6807\u8bb0\u4e3a\u91cd\u590d\u95e8\u5e97' })}
          </Button>
        </DialogActions>
      </Dialog>

      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function DuplicateStoreCompareCard({
  title,
  row,
  counterpart,
  statusColor,
  matchScore,
  matchDetails,
}: {
  title: string;
  row: SurveyHistoryItem;
  counterpart: SurveyHistoryItem;
  statusColor: SmartChipProps['color'];
  matchScore?: number;
  matchDetails?: DuplicateMatchDetails;
}) {
  const language = useCurrentLanguage();
  const sameDisplayValue = (left: string | number | null | undefined, right: string | number | null | undefined) => {
    const normalizedLeft = String(left ?? '').trim().toLowerCase();
    const normalizedRight = String(right ?? '').trim().toLowerCase();
    return Boolean(normalizedLeft && normalizedLeft === normalizedRight);
  };
  const hasArrayOverlap = (left: string[], right: string[]) => {
    const rightValues = new Set(right.map((item) => item.trim().toLowerCase()).filter(Boolean));
    return left.some((item) => rightValues.has(item.trim().toLowerCase()));
  };
  const isMatch = (key: DuplicateMatchKey) => Boolean(matchDetails?.matches[key]);
  const storeDistance = coordinateDistanceMeters(row, counterpart);
  const fields = [
    {
      label: localCopy(language, { id: 'Kode toko', en: 'Store code', zh: '\u95e8\u5e97\u7f16\u7801' }),
      value: row.storeCode,
      matched: sameDisplayValue(row.storeCode, counterpart.storeCode),
    },
    {
      label: localCopy(language, { id: 'Status verifikasi', en: 'Verification status', zh: '\u5ba1\u6838\u72b6\u6001' }),
      value: verificationStatusLabel(row.verificationStatus, language),
      matched: false,
    },
    {
      label: localCopy(language, { id: 'Kota', en: 'City', zh: '\u57ce\u5e02' }),
      value: detailValue(row.city),
      matched: isMatch('city'),
    },
    {
      label: localCopy(language, { id: 'Kecamatan', en: 'District', zh: '\u533a\u53bf' }),
      value: detailValue(row.district),
      matched: isMatch('district'),
    },
    {
      label: localCopy(language, { id: 'Kelurahan/desa', en: 'Village', zh: '\u6751/\u793e\u533a' }),
      value: detailValue(row.village),
      matched: isMatch('village'),
    },
    {
      label: localCopy(language, { id: 'Alamat', en: 'Address', zh: '\u5730\u5740' }),
      value: `${detailValue(row.addressDetail)}${row.landmark ? ` (${row.landmark})` : ''}`,
      matched: isMatch('addressDetail'),
    },
    {
      label: localCopy(language, { id: 'Narasumber', en: 'Contact person', zh: '\u8054\u7cfb\u4eba' }),
      value: detailValue(row.contactPersonName),
      matched: sameDisplayValue(row.contactPersonName, counterpart.contactPersonName),
    },
    {
      label: localCopy(language, { id: 'WhatsApp', en: 'WhatsApp', zh: 'WhatsApp' }),
      value: row.whatsappNumber || row.waEmptyReason || '-',
      matched: isMatch('whatsappNumber'),
    },
    {
      label: localCopy(language, { id: 'Koordinat', en: 'Coordinates', zh: '\u5750\u6807' }),
      value: row.latitude && row.longitude ? `${row.latitude}, ${row.longitude}` : '-',
      matched: isMatch('coordinates'),
    },
    {
      label: localCopy(language, { id: 'Supplier', en: 'Supplier', zh: '\u4f9b\u5e94\u5546' }),
      value: row.supplierName || row.supplierType.join(', ') || '-',
      matched: sameDisplayValue(row.supplierName, counterpart.supplierName),
    },
    {
      label: localCopy(language, { id: 'Produk cooling', en: 'Cooling products', zh: '\u51b7\u5374\u4ea7\u54c1' }),
      value: row.coolingProducts.join(', ') || '-',
      matched: hasArrayOverlap(row.coolingProducts, counterpart.coolingProducts),
    },
    {
      label: localCopy(language, { id: 'Skor', en: 'Score', zh: '\u5f97\u5206' }),
      value: `M ${row.merchantGrade} ${row.merchantPotentialScore}/100 / DQ ${dataQualityGradeLabel(row.dataQualityGrade, language)} ${row.dataQualityScore}/100`,
      matched: false,
    },
    {
      label: localCopy(language, { id: 'Waktu submit', en: 'Submit time', zh: '\u63d0\u4ea4\u65f6\u95f4' }),
      value: formatSubmittedAt(row.submitTime),
      matched: false,
    },
  ];

  return (
    <Paper className={`duplicate-compare-card ${statusColor === 'success' ? 'target' : 'source'}`}>
      <Stack spacing={1.4}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.2}>
          <Box minWidth={0}>
            <Typography variant="overline" className="duplicate-compare-label">
              {title}
            </Typography>
            <Typography fontWeight={950} data-no-i18n className={isMatch('storeName') ? 'duplicate-compare-store-name matched' : 'duplicate-compare-store-name'}>
              {row.storeName}
            </Typography>
            <Typography variant="caption" color="text.secondary" data-no-i18n>
              {row.surveyorName} - {row.managerName}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            {matchScore !== undefined && (
              <Chip
                size="small"
                label={`${matchScore}%`}
                color={matchScore >= DUPLICATE_WARNING_THRESHOLD ? 'success' : matchScore >= 45 ? 'warning' : 'info'}
                variant="outlined"
                reason={duplicateScoreReason(language)}
              />
            )}
            <Chip size="small" label={compactVerificationStatusLabel(row.verificationStatus, language)} color={statusColor} variant="outlined" />
          </Stack>
        </Stack>
        <Box className="duplicate-compare-field-grid">
          {fields.map((field) => (
            <Box key={field.label} className={field.matched ? 'duplicate-compare-field matched' : 'duplicate-compare-field'}>
              <Stack direction="row" spacing={0.7} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {field.label}
                </Typography>
                {field.matched && (
                  <Chip
                    size="small"
                    label={localCopy(language, { id: 'Cocok', en: 'Match', zh: '\u5339\u914d' })}
                    color="success"
                    variant="outlined"
                    className="duplicate-match-mini-chip"
                  />
                )}
              </Stack>
              <Typography variant="body2" data-no-i18n>
                {field.value}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className="duplicate-compare-map-section">
          <Typography variant="caption" color="text.secondary">
            {localCopy(language, { id: 'Peta toko dan pembanding', en: 'Store and comparison map', zh: '\u95e8\u5e97\u548c\u5bf9\u6bd4\u5730\u56fe' })}
          </Typography>
          <GpsMapPreview
            surveyLatitude={row.latitude}
            surveyLongitude={row.longitude}
            targetLatitude={counterpart.latitude}
            targetLongitude={counterpart.longitude}
            accuracy={row.gpsAccuracy || 0}
            distance={storeDistance ?? 0}
            language={language}
            copyOverrides={{
              title: localCopy(language, { id: 'Peta duplikat', en: 'Duplicate map', zh: '\u91cd\u590d\u5730\u56fe' }),
              surveyor: localCopy(language, { id: 'Toko ini', en: 'This store', zh: '\u672c\u95e8\u5e97' }),
              target: localCopy(language, { id: 'Toko pembanding', en: 'Compared store', zh: '\u5bf9\u6bd4\u95e8\u5e97' }),
              waiting: localCopy(language, {
                id: 'Koordinat toko ini belum tersedia; gunakan data pembanding jika ada.',
                en: 'This store has no coordinates yet; use the compared store data when available.',
                zh: '\u672c\u95e8\u5e97\u5c1a\u65e0\u5750\u6807\uff1b\u5982\u6709\u5bf9\u6bd4\u95e8\u5e97\u6570\u636e\u53ef\u5148\u53c2\u8003\u3002',
              }),
              noTarget: localCopy(language, {
                id: 'Toko pembanding belum memiliki koordinat.',
                en: 'The compared store has no coordinates yet.',
                zh: '\u5bf9\u6bd4\u95e8\u5e97\u5c1a\u65e0\u5750\u6807\u3002',
              }),
            }}
          />
        </Box>
        <Box className="duplicate-compare-photo-section">
          <Typography variant="caption" color="text.secondary">
            {localCopy(language, { id: 'Tiga foto evidence', en: 'Three evidence photos', zh: '\u4e09\u5f20\u51ed\u8bc1\u7167\u7247' })}
          </Typography>
          <SurveyPhotoEvidenceGrid survey={row} />
        </Box>
      </Stack>
    </Paper>
  );
}

function LegacyVerificationPage() {
  const [rows, setRows] = useState<SurveyHistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingDecision, setSavingDecision] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [revisionRequest, setRevisionRequest] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .surveys()
      .then((result) => {
        if (!active) return;
        setRows(result.surveys);
        const firstOpen = [...result.surveys].sort((left, right) => verificationPriority(left) - verificationPriority(right))[0];
        setSelectedId(firstOpen?.id ?? '');
      })
      .catch((error) => {
        if (active) setNotice({ message: error instanceof Error ? error.message : 'Queue verifikasi gagal dimuat.', severity: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const priorityRows = useMemo(
    () =>
      [...rows].sort((left, right) => {
        const priorityGap = verificationPriority(left) - verificationPriority(right);
        if (priorityGap) return priorityGap;
        const warningGap = visibleVerificationWarningFlags(right).length - visibleVerificationWarningFlags(left).length;
        if (warningGap) return warningGap;
        return new Date(right.submitTime).getTime() - new Date(left.submitTime).getTime();
      }),
    [rows],
  );
  const selected = rows.find((row) => row.id === selectedId) ?? priorityRows[0];
  const stats = useMemo(
    () => ({
      pending: rows.filter((row) => openVerificationStatuses.includes(row.verificationStatus)).length,
      warning: rows.filter((row) => visibleVerificationWarningFlags(row).length).length,
      duplicate: rows.filter(hasDuplicateWarning).length,
      missingPhoto: rows.filter(hasMissingPhoto).length,
      gps: rows.filter((row) => row.gpsWarningFlag || row.gpsDistanceFromTarget > 100).length,
      needRevision: rows.filter((row) => row.verificationStatus === 'NEED_REVISION').length,
      rejected: rows.filter((row) => row.verificationStatus === 'REJECTED_INVALID').length,
    }),
    [rows],
  );

  useEffect(() => {
    setVerificationNotes(selected?.verificationNotes ?? '');
    setRevisionRequest(selected?.revisionRequest ?? '');
  }, [selected?.id, selected?.verificationNotes, selected?.revisionRequest]);

  const decide = async (status: VerificationDecision) => {
    if (!selected) return;
    if (status === 'NEED_REVISION' && !revisionRequest.trim()) {
      setNotice({ message: 'Isi revision request sebelum mengirim Need Revision.', severity: 'warning' });
      return;
    }

    setSavingDecision(true);
    try {
      const result = await api.verifySurvey(selected.id, {
        status,
        verificationNotes,
        revisionRequest: status === 'NEED_REVISION' ? revisionRequest : undefined,
      });
      setRows((currentRows) => currentRows.map((row) => (row.id === result.survey.id ? result.survey : row)));
      setNotice({ message: `${selected.storeName}: ${verificationDecisionLabels[status]}.`, severity: status === 'VERIFIED_VALID' ? 'success' : 'warning' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Keputusan verifikasi gagal disimpan.', severity: 'error' });
    } finally {
      setSavingDecision(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="metric-grid verification-metrics">
        <ScoreBadge label="Pending" value={String(stats.pending)} caption="Waiting + need revision" tone="#61c8ff" />
        <ScoreBadge label="Warning Queue" value={String(stats.warning)} caption="Prioritas pertama PRD" tone="#f5c84c" />
        <ScoreBadge label="GPS Warning" value={String(stats.gps)} caption=">100m / perlu cek maps" tone="#ff8b73" />
        <ScoreBadge label="Missing Photo" value={String(stats.missingPhoto)} caption="Evidence perlu review" tone="#b28cff" />
        <ScoreBadge label="Duplicate" value={String(stats.duplicate)} caption="Candidate merge" tone="#7da4ff" />
        <ScoreBadge label="Rejected" value={String(stats.rejected)} caption="Invalid data summary" tone="#ff8b73" />
      </Box>

      <Box className="verification-layout">
        <Paper className="section-panel wide">
          <SectionTitle
            icon={<FactCheckRoundedIcon />}
            title="Verification Priority Queue"
            action={<Chip icon={<WarningAmberRoundedIcon />} label={`${stats.pending} pending`} color="warning" />}
          />
          {loading ? (
            <LinearProgress />
          ) : (
            <>
              <Table size="small" className="verification-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Priority</TableCell>
                    <TableCell>Store</TableCell>
                    <TableCell>Surveyor</TableCell>
                    <TableCell>Lead</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Age</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priorityRows.map((row) => (
                    <TableRow key={row.id} hover selected={row.id === selected?.id} onClick={() => setSelectedId(row.id)} sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Chip size="small" label={priorityLabel(row)} color={verificationPriority(row) === 1 ? 'warning' : 'default'} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={900} data-no-i18n>
                          {row.storeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.city} / {row.district}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.surveyorName}</TableCell>
                      <TableCell>
                        <Chip size="small" label={row.leadClassification} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={`${row.dataQualityGrade} ${row.dataQualityScore}`}
                          color={row.dataQualityGrade === 'Good' ? 'success' : row.dataQualityGrade === 'Poor' ? 'error' : 'warning'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={row.verificationStatus} color={statusChipColor(row.verificationStatus)} variant="outlined" />
                      </TableCell>
                      <TableCell>{formatAge(row.submitTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Stack spacing={1.2} className="verification-card-list">
                {priorityRows.map((row) => (
                  <Paper
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    className={`verification-card ${row.id === selected?.id ? 'active' : ''}`}
                    onClick={() => setSelectedId(row.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId(row.id);
                      }
                    }}
                  >
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Box minWidth={0}>
                          <Typography fontWeight={900} data-no-i18n>
                            {row.storeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.city} - {row.surveyorName}
                          </Typography>
                        </Box>
                        <Chip size="small" label={priorityLabel(row)} color={verificationPriority(row) === 1 ? 'warning' : 'default'} variant="outlined" />
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={row.leadClassification} color={isHotOrQualified(row) ? 'secondary' : 'primary'} variant="outlined" />
                        <Chip size="small" label={`${row.dataQualityGrade} ${row.dataQualityScore}`} variant="outlined" />
                        <Chip size="small" label={formatAge(row.submitTime)} variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {visibleVerificationWarningFlags(row).length ? visibleVerificationWarningFlags(row).map(verificationWarningLabel).join(', ') : row.verificationStatus}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </>
          )}
        </Paper>

        <Paper className="section-panel verification-detail-panel">
          <SectionTitle icon={<GppMaybeRoundedIcon />} title="Verification Detail" />
          {selected ? (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: 'primary.main' }}>
                  <StorefrontRoundedIcon />
                </Avatar>
                <Box minWidth={0}>
                  <Typography fontWeight={900} data-no-i18n>
                    {selected.storeName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selected.storeCode} - {selected.surveyorName}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={selected.verificationStatus} color={statusChipColor(selected.verificationStatus)} />
                <Chip size="small" label={selected.leadClassification} color={isHotOrQualified(selected) ? 'secondary' : 'primary'} variant="outlined" />
                <Chip size="small" label={`${selected.merchantGrade} / ${selected.merchantPotentialScore}`} variant="outlined" />
              </Stack>

              <SurveyPhotoEvidenceGrid survey={selected} />

              <Stack spacing={1}>
                <ContactActionRow row={selected} />
                <CoordinateActionRow row={selected} />
                <ReviewCheck label="Alamat" value={`${selected.addressDetail} (${selected.landmark})`} state={selected.addressDetail ? 'ok' : 'warning'} />
                <ReviewCheck
                  label="GPS"
                  value={`${selected.gpsDistanceFromTarget}m dari target, akurasi ${selected.gpsAccuracy}m`}
                  state={selected.gpsWarningFlag || selected.gpsDistanceFromTarget > 100 ? 'warning' : 'ok'}
                />
                <ReviewCheck
                  label="Photo Evidence"
                  value={hasMissingPhoto(selected) ? selected.photoMissingReason || 'Ada evidence yang belum lengkap' : 'Front, rack, dan PIC tersedia'}
                  state={hasMissingPhoto(selected) ? 'warning' : 'ok'}
                />
                <ReviewCheck
                  label="Duplicate"
                  value={
                    hasDuplicateWarning(selected)
                      ? `${selected.duplicateCandidateCount} kandidat merge, skor tertinggi ${selected.duplicateTopScore}%`
                      : 'Belum ada kandidat merge valid'
                  }
                  state={hasDuplicateWarning(selected) ? 'warning' : 'ok'}
                />
                <ReviewCheck
                  label="Cooling vs Supplier"
                  value={`${selected.coolingProducts.join(', ') || '-'} / ${selected.supplierName}`}
                  state={selected.coolingProducts.length && selected.supplierName ? 'ok' : 'warning'}
                />
                <ReviewCheck
                  label="WA Rule"
                  value={selected.whatsappNumber ? 'WA tersedia, eligible Hot Lead jika score tinggi' : selected.waEmptyReason || 'WA kosong tanpa alasan'}
                  state={selected.whatsappNumber || selected.waEmptyReason ? 'ok' : 'warning'}
                />
              </Stack>

              <TextField
                label="Verification notes"
                value={verificationNotes}
                onChange={(event) => setVerificationNotes(event.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                label="Revision request"
                value={revisionRequest}
                onChange={(event) => setRevisionRequest(event.target.value)}
                placeholder="Wajib diisi jika memilih Need Revision"
                multiline
                minRows={2}
                fullWidth
              />

              <Stack spacing={1}>
                <Button variant="contained" color="success" startIcon={<CheckCircleRoundedIcon />} disabled={savingDecision} onClick={() => decide('VERIFIED_VALID')}>
                  Verified Valid
                </Button>
                <Button variant="outlined" color="warning" startIcon={<SyncProblemRoundedIcon />} disabled={savingDecision} onClick={() => decide('NEED_REVISION')}>
                  Need Revision
                </Button>
                <Button variant="outlined" color="error" startIcon={<WarningAmberRoundedIcon />} disabled={savingDecision} onClick={() => decide('REJECTED_INVALID')}>
                  Reject Invalid
                </Button>
                <Button variant="outlined" startIcon={<PublishedWithChangesRoundedIcon />} disabled={savingDecision} onClick={() => decide('MERGED_DUPLICATE')}>
                  Merge Duplicate
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography color="text.secondary">Tidak ada queue verifikasi.</Typography>
          )}
        </Paper>
      </Box>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function ContactActionRow({ row }: { row: SurveyHistoryItem }) {
  const language = useCurrentLanguage();
  const waUrl = whatsappUrl(row.whatsappNumber, row.storeName, row.contactPersonName);
  const callUrl = phoneCallUrl(row.whatsappNumber);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" className="check-row action-check-row" gap={1}>
      <Box minWidth={0}>
        <Typography>Kontak customer</Typography>
        <Typography variant="body2" color="text.secondary">
          {row.whatsappNumber || row.waEmptyReason || 'Tidak ada nomor'}
        </Typography>
      </Box>
      <Stack direction="row" spacing={0.8} flex="0 0 auto">
        <Tooltip
          title={
            callUrl
              ? localCopy(language, { id: 'Telepon customer memakai panggilan seluler/perangkat, bukan WhatsApp.', en: 'Call the customer through the device phone dialer, not WhatsApp.', zh: '通过设备电话拨号联系客户，而不是 WhatsApp。' })
              : localCopy(language, { id: 'Nomor customer belum tersedia pada survey ini.', en: 'No customer phone number is available for this survey.', zh: '本次调研没有可用的客户电话号码。' })
          }
        >
          <span>
            <IconButton
              className="phone-action-button"
              aria-label={`Telepon ${row.storeName}`}
              disabled={!callUrl}
              onClick={() => {
                if (callUrl) window.location.href = callUrl;
              }}
            >
              <PhoneRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={
            waUrl
              ? localCopy(language, { id: 'Buka WhatsApp dengan pesan follow-up untuk toko ini.', en: 'Open WhatsApp with a follow-up message for this store.', zh: '打开 WhatsApp，并带入该门店的跟进消息。' })
              : localCopy(language, { id: 'Nomor WhatsApp belum tersedia pada survey ini.', en: 'No WhatsApp number is available for this survey.', zh: '本次调研没有可用的 WhatsApp 号码。' })
          }
        >
          <span>
            <IconButton
              className="wa-action-button"
              aria-label={`WhatsApp ${row.storeName}`}
              disabled={!waUrl}
              onClick={() => {
                if (waUrl) window.open(waUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

function ContactVerificationChecklist({
  row,
  phoneCallable,
  whatsappReachable,
  onPhoneCallableChange,
  onWhatsappReachableChange,
  readOnly = false,
}: {
  row: SurveyHistoryItem;
  phoneCallable: boolean;
  whatsappReachable: boolean;
  onPhoneCallableChange: (value: boolean) => void;
  onWhatsappReachableChange: (value: boolean) => void;
  readOnly?: boolean;
}) {
  const language = useCurrentLanguage();
  const hasNumber = Boolean(row.whatsappNumber);
  const checkedAt = row.verifierContactCheckedAt ? formatSubmittedAt(row.verifierContactCheckedAt) : 'Belum tersimpan';

  return (
    <Stack className="contact-verification-checklist" spacing={1.2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
        <Box minWidth={0}>
          <Typography fontWeight={900}>
            Checklist kontak verifikator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasNumber
              ? localCopy(language, {
                  id: 'Status ini mempengaruhi Merchant Score, Data Quality, Hot Lead, dan dashboard follow-up.',
                  en: 'This status affects Merchant Score, Data Quality, Hot Lead eligibility, and follow-up dashboards.',
                  zh: '该状态会影响商户评分、数据质量、高意向线索资格和跟进看板。',
                })
              : localCopy(language, {
                  id: 'Tidak ada nomor customer, checklist kontak otomatis dianggap tidak reachable.',
                  en: 'No customer number is available, so contact checks are treated as unreachable.',
                  zh: '没有客户号码，因此联系检查会被视为不可达。',
                })}
          </Typography>
        </Box>
        <Chip size="small" label={checkedAt} variant="outlined" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
        <FormControlLabel
          className="contact-check-toggle"
          control={
            <Switch
              checked={phoneCallable}
              disabled={!hasNumber || readOnly}
              onChange={(event) => onPhoneCallableChange(event.target.checked)}
              color="success"
            />
          }
          label="Bisa ditelepon"
        />
        <FormControlLabel
          className="contact-check-toggle"
          control={
            <Switch
              checked={whatsappReachable}
              disabled={!hasNumber || readOnly}
              onChange={(event) => onWhatsappReachableChange(event.target.checked)}
              color="success"
            />
          }
          label="Bisa dihubungi WhatsApp"
        />
      </Stack>
    </Stack>
  );
}

function VerificationLocationReviewCard({ row }: { row: SurveyHistoryItem }) {
  const language = useCurrentLanguage();
  const mapsHref = googleMapsUrl(row.latitude, row.longitude);
  const gpsNeedsReview = row.gpsWarningFlag || row.gpsDistanceFromTarget > 100;

  return (
    <Box className="verification-location-review">
      <Box className="verification-location-map-preview">
        <Suspense
          fallback={
            <Box className="verification-map-loading">
              <LinearProgress />
            </Box>
          }
        >
          <GpsMapPreview
            surveyLatitude={row.latitude}
            surveyLongitude={row.longitude}
            accuracy={row.gpsAccuracy}
            distance={row.gpsDistanceFromTarget}
            language={language}
            copyOverrides={{
              title: localCopy(language, {
                id: 'Preview koordinat toko',
                en: 'Store coordinate preview',
                zh: '门店坐标预览',
              }),
              surveyor: localCopy(language, {
                id: 'Titik submit',
                en: 'Submitted point',
                zh: '提交点',
              }),
              target: localCopy(language, {
                id: 'Target toko',
                en: 'Store target',
                zh: '门店目标点',
              }),
              waiting: localCopy(language, {
                id: 'Koordinat toko belum tersedia.',
                en: 'Store coordinates are not available yet.',
                zh: '暂无门店坐标。',
              }),
              noTarget: localCopy(language, {
                id: 'Koordinat toko belum tersedia untuk ditampilkan.',
                en: 'Store coordinates are not available to display yet.',
                zh: '暂无可显示的门店坐标。',
              }),
              surveyOnly: localCopy(language, {
                id: 'Titik submit toko tersimpan di detail verifikasi.',
                en: 'Submitted store point is stored in verification detail.',
                zh: '已提交门店点位保存在审核详情中。',
              }),
            }}
          />
        </Suspense>
      </Box>
      <Stack className="verification-location-address-panel" spacing={1.2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={1}>
          <Box minWidth={0}>
            <Typography fontWeight={900}>Detail alamat toko</Typography>
            <Typography variant="body2" color="text.secondary" data-no-i18n>
              {row.addressDetail || '-'}
            </Typography>
          </Box>
          {mapsHref && (
            <Button size="small" variant="outlined" startIcon={<MapRoundedIcon />} href={mapsHref} target="_blank" rel="noreferrer">
              Google Maps
            </Button>
          )}
        </Stack>
        {gpsNeedsReview && (
          <Alert severity="warning" variant="outlined" className="verification-location-alert">
            {localCopy(language, {
              id: `Koordinat perlu dicek: jarak dari target ${row.gpsDistanceFromTarget}m dengan akurasi ${row.gpsAccuracy}m.`,
              en: `Coordinates need review: ${row.gpsDistanceFromTarget}m from target with ${row.gpsAccuracy}m accuracy.`,
              zh: `坐标需要复核：距目标 ${row.gpsDistanceFromTarget} 米，精度 ${row.gpsAccuracy} 米。`,
            })}
          </Alert>
        )}
        <Box className="verification-location-field-grid">
          <SurveyDetailField label="Provinsi" value={detailText(row.province)} />
          <SurveyDetailField label="Kota/Kabupaten" value={detailText(row.city)} />
          <SurveyDetailField label="Kecamatan" value={detailText(row.district)} />
          <SurveyDetailField label="Desa/Kelurahan" value={detailText(row.village)} />
          <SurveyDetailField label="Patokan" value={detailText(row.landmark)} noI18n />
          <SurveyDetailField label="Latitude" value={detailText(row.latitude)} noI18n />
          <SurveyDetailField label="Longitude" value={detailText(row.longitude)} noI18n />
          <SurveyDetailField label="GPS" value={`${row.gpsDistanceFromTarget}m / akurasi ${row.gpsAccuracy}m`} />
        </Box>
      </Stack>
    </Box>
  );
}

function CoordinateActionRow({ row }: { row: SurveyHistoryItem }) {
  const language = useCurrentLanguage();
  const url = googleMapsUrl(row.latitude, row.longitude);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" className="check-row action-check-row" gap={1}>
      <Box minWidth={0}>
        <Typography>Koordinat toko</Typography>
        <Typography variant="body2" color="text.secondary">
          {row.latitude}, {row.longitude}
        </Typography>
      </Box>
      <Tooltip
        title={
          url
            ? localCopy(language, { id: 'Buka koordinat toko ini di Google Maps.', en: 'Open this store coordinate in Google Maps.', zh: '在 Google Maps 中打开该门店坐标。' })
            : localCopy(language, { id: 'Koordinat toko belum tersedia pada survey ini.', en: 'No store coordinates are available for this survey.', zh: '本次调研没有可用的门店坐标。' })
        }
      >
        <span>
          <IconButton
            className="maps-action-button"
            aria-label={`Google Maps ${row.storeName}`}
            disabled={!url}
            onClick={() => {
              if (url) window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            <MapRoundedIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

function ReviewCheck({ label, value, state }: { label: string; value: string; state: 'ok' | 'warning' }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" className="check-row" gap={1}>
      <Typography>{label}</Typography>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" minWidth={0}>
        <Typography variant="body2" color="text.secondary" textAlign="right">
          {value}
        </Typography>
        {state === 'ok' ? <CheckCircleRoundedIcon color="success" fontSize="small" /> : <WarningAmberRoundedIcon color="warning" fontSize="small" />}
      </Stack>
    </Stack>
  );
}

type IntelligenceChartTab = 'brand' | 'supplier' | 'city';

function IntelligencePage() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [activeChart, setActiveChart] = useState<IntelligenceChartTab>('brand');
  const [leadFilter, setLeadFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [waOnly, setWaOnly] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const exportRows = analytics?.hotLeadPreview ?? [];
  useEffect(() => {
    api
      .analytics()
      .then(setAnalytics)
      .catch((error) => setNotice({ message: error instanceof Error ? error.message : 'Market intelligence gagal dimuat.', severity: 'error' }));
  }, []);
  const exportHotLeads = async () => {
    try {
      const result = await api.exportData('hot-qualified-leads');
      const { downloadXlsx } = await import('./utils/xlsx');
      downloadXlsx('klwt-hot-lead-export.xlsx', result.rows, 'Hot Leads');
      setNotice({ message: 'Hot Lead export dibuat dalam format XLSX.', severity: 'success' });
    } catch (error) {
      setNotice({ message: error instanceof Error ? error.message : 'Export Hot Lead gagal dibuat.', severity: 'error' });
    }
  };
  const metrics = analytics?.metrics;
  const submitted = metrics?.submitted ?? 0;
  const hotQualified = (metrics?.hot ?? 0) + (metrics?.qualified ?? 0);
  const opportunityRate = submitted ? Math.round((hotQualified / submitted) * 100) : 0;
  const chartRows =
    activeChart === 'brand'
      ? analytics?.brandBars ?? []
      : activeChart === 'supplier'
        ? analytics?.supplierTypeBars ?? []
        : analytics?.cityBars ?? [];
  const chartMax = Math.max(...chartRows.map((row) => row.value), 1);
  const chartContext: BarTooltipContext = activeChart === 'brand' ? 'brand' : 'default';
  const leadOptions = useMemo(() => ['all', ...Array.from(new Set(exportRows.map((row) => row.leadClassification))).sort()], [exportRows]);
  const cityOptions = useMemo(() => ['all', ...Array.from(new Set(exportRows.map((row) => row.city).filter(Boolean))).sort()], [exportRows]);
  const filteredLeadRows = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    return exportRows
      .filter((row) => leadFilter === 'all' || row.leadClassification === leadFilter)
      .filter((row) => cityFilter === 'all' || row.city === cityFilter)
      .filter((row) => !waOnly || isVerifiedWaReachable(row))
      .filter((row) => {
        if (!query) return true;
        return [row.storeName, row.city, row.district, row.supplierName, row.businessType, row.mainPurchaseDriver.join(' '), row.whatsappNumber]
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort(
        (left, right) =>
          right.merchantPotentialScore - left.merchantPotentialScore ||
          right.dataQualityScore - left.dataQualityScore ||
          left.storeName.localeCompare(right.storeName),
      );
  }, [cityFilter, exportRows, leadFilter, leadSearch, waOnly]);
  const topCity = analytics?.cityBars[0];
  const topBrand = analytics?.brandBars[0];
  const topSupplier = analytics?.supplierTypeBars[0];
  const scoreCards = [
    {
      label: 'Lead pipeline',
      value: hotQualified.toLocaleString('id-ID'),
      caption: `${opportunityRate}% Hot + Qualified`,
      tone: '#f5c84c',
      icon: <FlashOnRoundedIcon />,
      onOpen: () => setLeadFilter('all'),
    },
    {
      label: 'WA reachable',
      value: `${metrics?.waContactability ?? 0}%`,
      caption: 'Dikonfirmasi verifikator',
      tone: '#61c8ff',
      icon: <WhatsAppIcon />,
      onOpen: () => setWaOnly(true),
    },
    {
      label: 'Supplier pain',
      value: `${metrics?.supplierDissatisfaction ?? 0}%`,
      caption: 'Keluhan atau cari alternatif',
      tone: '#ff8b73',
      icon: <LocalShippingRoundedIcon />,
      onOpen: () => setActiveChart('supplier'),
    },
    {
      label: 'Data reliability',
      value: `${metrics?.photoEvidenceComplete ?? 0}%`,
      caption: `DQ ${metrics?.avgDataQuality ?? 0} / valid ${metrics?.validRate ?? 0}%`,
      tone: '#2fd0a8',
      icon: <VerifiedRoundedIcon />,
      onOpen: () => undefined,
    },
  ];
  const insightCards = [
    {
      label: 'Kota terkuat',
      value: topCity?.label ?? '-',
      caption: `${topCity?.value ?? 0} survey masuk pipeline terlihat`,
      tone: '#2fd0a8',
    },
    {
      label: 'Brand paling terlihat',
      value: topBrand?.label ?? '-',
      caption: `${topBrand?.value ?? 0} kemunculan brand cooling`,
      tone: '#61c8ff',
    },
    {
      label: 'Channel supplier dominan',
      value: topSupplier?.label ?? '-',
      caption: `${topSupplier?.value ?? 0} toko memakai channel ini`,
      tone: '#f5c84c',
    },
  ];

  return (
    <Stack spacing={2.4} className="market-intelligence-page">
      {!analytics && <LinearProgress />}

      <Paper className="section-panel market-hero-panel">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} gap={2}>
          <Box minWidth={0}>
            <Typography variant="overline" color="primary" fontWeight={950}>
              MARKET INTELLIGENCE
            </Typography>
            <Typography variant="h5" fontWeight={950}>
              Sinyal peluang cooling, supplier, dan lead siap follow-up
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {submitted.toLocaleString('id-ID')} survey terlihat, {hotQualified.toLocaleString('id-ID')} lead prioritas, {filteredLeadRows.length.toLocaleString('id-ID')} masuk filter aktif.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Chip size="small" label={`Avg M ${metrics?.avgMerchantScore ?? 0}`} color="warning" variant="outlined" />
            <Chip size="small" label={`Avg DQ ${metrics?.avgDataQuality ?? 0}`} color="success" variant="outlined" />
            <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={exportHotLeads}>
              Download XLSX
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box className="market-score-grid">
        {scoreCards.map((card) => (
          <Paper
            key={card.label}
            className="market-score-card"
            role="button"
            tabIndex={0}
            sx={{ '--market-tone': card.tone } as React.CSSProperties}
            onClick={card.onOpen}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.onOpen();
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
              <Box minWidth={0}>
                <Typography variant="caption" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography className="market-score-value">{card.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.caption}
                </Typography>
              </Box>
              <Avatar className="market-score-icon">{card.icon}</Avatar>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Box className="market-workbench-grid">
        <Paper className="section-panel market-chart-panel">
          <SectionTitle
            icon={<RadarRoundedIcon />}
            title="Market Signal Map"
            action={
              <Tabs value={activeChart} onChange={(_, value: IntelligenceChartTab) => setActiveChart(value)} className="market-chart-tabs">
                <Tab value="brand" label="Brand" />
                <Tab value="supplier" label="Supplier" />
                <Tab value="city" label="Kota" />
              </Tabs>
            }
          />
          <BarList rows={chartRows} max={chartMax} context={chartContext} />
        </Paper>

        <Paper className="section-panel market-chart-panel">
          <SectionTitle icon={<FlashOnRoundedIcon />} title="Lead Classification" />
          <LeadDonutChart rows={analytics?.leadBars ?? []} />
        </Paper>
      </Box>

      <Box className="market-insight-grid">
        {insightCards.map((card) => (
          <Paper key={card.label} className="market-insight-card" sx={{ '--market-tone': card.tone } as React.CSSProperties}>
            <Typography variant="caption" color="text.secondary">
              {card.label}
            </Typography>
            <Typography fontWeight={950} data-no-i18n>
              {card.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.caption}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper className="section-panel market-lead-panel">
          <SectionTitle
            icon={<DownloadRoundedIcon />}
          title="Priority Lead Worklist"
          action={<Chip size="small" label={`${filteredLeadRows.length}/${exportRows.length} toko`} variant="outlined" />}
          />
        <Box className="market-lead-controls">
          <TextField
            size="small"
            label="Cari toko"
            value={leadSearch}
            onChange={(event) => setLeadSearch(event.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
          <TextField select size="small" label="Lead" value={leadFilter} onChange={(event) => setLeadFilter(event.target.value)}>
            {leadOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === 'all' ? 'Semua lead' : option}
              </MenuItem>
            ))}
          </TextField>
          <TextField select size="small" label="Kota" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
            {cityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === 'all' ? 'Semua kota' : option}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel control={<Switch checked={waOnly} onChange={(event) => setWaOnly(event.target.checked)} />} label="WA reachable" />
        </Box>
          <Table size="small" className="lead-export-table">
            <TableHead>
              <TableRow>
                <TableCell>Store</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Lead</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>WA</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {!filteredLeadRows.length && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada lead pada filter aktif.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filteredLeadRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography fontWeight={900} data-no-i18n>
                      {row.storeName}
                    </Typography>
                  </TableCell>
                <TableCell>{row.city} / {row.district}</TableCell>
                <TableCell>
                  <Chip size="small" label={row.leadClassification} color={leadChipColor(row.leadClassification)} variant="outlined" />
                </TableCell>
                  <TableCell>{row.mainPurchaseDriver.join(', ')}</TableCell>
                  <TableCell>{row.supplierName}</TableCell>
                <TableCell>
                  {row.whatsappNumber && isVerifiedWaReachable(row) ? (
                    <Button size="small" startIcon={<WhatsAppIcon />} href={whatsappUrl(row.whatsappNumber, row.storeName, row.contactPersonName)} target="_blank" rel="noreferrer">
                      WA
                    </Button>
                  ) : (
                    row.whatsappNumber ? 'Tidak reachable' : row.waEmptyReason || 'Missing'
                  )}
                </TableCell>
                  <TableCell>
                    <Chip size="small" label={row.merchantGrade} color="secondary" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack spacing={1.2} className="lead-card-list">
          {filteredLeadRows.map((row) => (
              <Paper key={row.id} className="lead-card">
                <Stack spacing={1.2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box minWidth={0}>
                      <Typography fontWeight={900} data-no-i18n>
                        {row.storeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                      {row.city} / {row.district}
                      </Typography>
                    </Box>
                    <Chip size="small" label={row.merchantGrade} color="secondary" />
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label={row.leadClassification} color={leadChipColor(row.leadClassification)} variant="outlined" />
                    <Chip size="small" label={row.mainPurchaseDriver.join(', ')} variant="outlined" />
                    <Chip size="small" label={row.supplierName} variant="outlined" />
                    <Chip
                      size="small"
                      label={`WA ${isVerifiedWaReachable(row) ? 'Reachable' : row.whatsappNumber ? 'Not reachable' : 'Missing'}`}
                      color={isVerifiedWaReachable(row) ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
      </Paper>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function ImportXlsxDialog({
  open,
  templateKey,
  onClose,
  onSubmit,
  submitting = false,
}: {
  open: boolean;
  templateKey: ImportTemplateKey;
  onClose: () => void;
  onSubmit: (file: File) => void | Promise<void>;
  submitting?: boolean;
}) {
  const language = useCurrentLanguage();
  const t = (text: string) => translateInline(text, language);
  const copy = (value: Record<AppLanguage, string>) => localCopy(language, value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const template = importTemplates[templateKey];

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setFileError('');
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [open]);

  const selectFile = (file?: File) => {
    if (!file) return;
    const isXlsx = file.name.toLowerCase().endsWith('.xlsx');
    if (!isXlsx) {
      setSelectedFile(null);
      setFileError('Only .xlsx file format is supported.');
      return;
    }
    setSelectedFile(file);
    setFileError('');
  };

  const submitFile = () => {
    if (!selectedFile) return;
    onSubmit(selectedFile);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="import-xlsx-dialog">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Box minWidth={0}>
            <Typography variant="h6">{t(template.title)}</Typography>
            <Typography variant="caption" color="text.secondary">
              {template.filename} - {template.headers.length} {copy({ id: 'kolom wajib', en: 'required columns', zh: '个必填列' })}
            </Typography>
          </Box>
          <IconButton aria-label={t('Close import dialog')} onClick={onClose} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.2} pt={1}>
          <Alert severity="info" variant="outlined" className="import-template-alert">
            {copy({
              id: 'Gunakan template resmi agar validasi header, lokasi, dan role berjalan konsisten di backend.',
              en: 'Use the official template so header, location, and role validation remain consistent on the backend.',
              zh: '请使用官方模板，以确保后端表头、位置和角色校验保持一致。',
            })}
          </Alert>
          <Box
            className={`import-dropzone ${selectedFile ? 'has-file' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => !submitting && inputRef.current?.click()}
            onKeyDown={(event) => {
              if (!submitting && (event.key === 'Enter' || event.key === ' ')) inputRef.current?.click();
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectFile(event.dataTransfer.files[0]);
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={(event) => selectFile(event.target.files?.[0])}
            />
            <UploadFileRoundedIcon className="import-dropzone-icon" />
            <Typography fontWeight={800}>{selectedFile ? selectedFile.name : t('Select Import File')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedFile ? `${Math.max(1, Math.round(selectedFile.size / 1024))} KB selected` : t('Click or drop the completed template here')}
            </Typography>
          </Box>
          <Typography variant="body2" color={fileError ? 'error' : 'text.secondary'}>
            {fileError ? t(fileError) : t('Only .xlsx file format is supported.')}
          </Typography>
          <Box className="import-required-columns">
            <Typography variant="caption" fontWeight={900} color="text.secondary">
              {copy({ id: 'Kolom wajib', en: 'Required columns', zh: '必填列' })}
            </Typography>
            <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
              {template.headers.slice(0, 10).map((header) => (
                <Chip key={header} size="small" label={header} variant="outlined" />
              ))}
              {template.headers.length > 10 && <Chip size="small" label={`+${template.headers.length - 10}`} variant="outlined" />}
            </Stack>
          </Box>
          <Button
            variant="text"
            startIcon={<DownloadRoundedIcon />}
            className="template-download-link"
            onClick={() => {
              void import('./utils/xlsx')
                .then(({ downloadXlsxTemplate }) => downloadXlsxTemplate(templateKey))
                .catch(() => setFileError('Template gagal dibuat.'));
            }}
          >
            {t('Click to download the import template')}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>{t('Cancel')}</Button>
        <Button variant="contained" disabled={!selectedFile || submitting} onClick={submitFile}>
          {submitting ? t('Processing...') : t('Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type DataOpsTab = 'health' | 'import' | 'export' | 'activity';

function AdminPage({ role }: { role: Role }) {
  const language = useCurrentLanguage();
  const t = (text: string) => translateInline(text, language);
  const copy = (value: Record<AppLanguage, string>) => localCopy(language, value);
  const [importDialog, setImportDialog] = useState<ImportTemplateKey | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [importSubmitting, setImportSubmitting] = useState(false);
  const [activeOpsTab, setActiveOpsTab] = useState<DataOpsTab>('health');
  const [exportSearch, setExportSearch] = useState('');
  const [exportStatusFilter, setExportStatusFilter] = useState<'all' | 'Ready' | 'Processing'>('all');
  const [lastImportResult, setLastImportResult] = useState<ImportResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const visibleImportTemplates = useMemo(
    () => (Object.keys(importTemplates) as ImportTemplateKey[]).filter((item) => importTemplates[item].roles.includes(role)),
    [role],
  );

  const locale = language === 'en' ? 'en-US' : language === 'zh' ? 'zh-CN' : 'id-ID';
  const metrics = analytics?.metrics;
  const systemStatus = analytics?.systemStatus ?? [];
  const exportJobs = analytics?.exportJobs ?? [];
  const enabledSystemCount = systemStatus.filter((item) => item.enabled).length;
  const healthScore = systemStatus.length ? Math.round((enabledSystemCount / systemStatus.length) * 100) : 0;
  const submittedRows = metrics?.submitted ?? 0;
  const warningRows = metrics?.warning ?? 0;
  const warningRate = submittedRows ? Math.round((warningRows / submittedRows) * 100) : 0;
  const validRate = Math.round(metrics?.validRate ?? 0);
  const readyExportJobs = exportJobs.filter((job) => job.status === 'Ready').length;
  const totalExportRows = exportJobs.reduce((sum, job) => sum + job.rowCount, 0);
  const latestExport = exportJobs
    .slice()
    .sort((first, second) => Date.parse(second.completedAt || second.createdAt) - Date.parse(first.completedAt || first.createdAt))[0];
  const filteredExportJobs = exportJobs.filter((job) => {
    const haystack = `${job.name} ${job.scope} ${job.ownerRole} ${job.status}`.toLowerCase();
    const matchesSearch = !exportSearch.trim() || haystack.includes(exportSearch.trim().toLowerCase());
    const matchesStatus = exportStatusFilter === 'all' || job.status === exportStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const lastImportSeverity = lastImportResult?.errors.length ? 'warning' : 'success';

  const formatCount = (value: number) => value.toLocaleString(locale);
  const formatRows = (value: number) =>
    copy({
      id: `${formatCount(value)} baris`,
      en: `${formatCount(value)} rows`,
      zh: `${formatCount(value)} 行`,
    });
  const formatDateTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value || '-';
    return parsed.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
  };
  const formatSystemDetail = (label: string, detail: string) => {
    if (label === 'Backend SQLite') {
      return copy({
        id: `${formatCount(metrics?.submitted ?? 0)} baris survey tersimpan`,
        en: `${formatCount(metrics?.submitted ?? 0)} survey rows stored`,
        zh: `${formatCount(metrics?.submitted ?? 0)} 条调研记录已存储`,
      });
    }
    if (label === 'Territory master') {
      const locationCount = Number(detail.replace(/\D/g, '')) || 0;
      return copy({
        id: `${formatCount(locationCount)} lokasi aktif`,
        en: `${formatCount(locationCount)} active locations`,
        zh: `${formatCount(locationCount)} 个启用地点`,
      });
    }
    return t(detail);
  };

  const refreshAnalytics = async (announce = true) => {
    setRefreshing(true);
    try {
      const result = await api.analytics();
      setAnalytics(result);
      if (announce) {
        setNotice({
          message: copy({
            id: 'Status operasi data berhasil diperbarui.',
            en: 'Data operations status has been refreshed.',
            zh: '数据运营状态已刷新。',
          }),
          severity: 'success',
        });
      }
    } catch (error) {
      setNotice({
        message: error instanceof Error ? error.message : copy({ id: 'Status sistem gagal dimuat.', en: 'Failed to load system status.', zh: '系统状态加载失败。' }),
        severity: 'error',
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void refreshAnalytics(false);
  }, []);

  const downloadImportTemplate = async (templateKey: ImportTemplateKey) => {
    try {
      const { downloadXlsxTemplate } = await import('./utils/xlsx');
      downloadXlsxTemplate(templateKey);
      setNotice({
        message: copy({
          id: `${importTemplates[templateKey].title} berhasil dibuat.`,
          en: `${importTemplates[templateKey].title} has been generated.`,
          zh: `${importTemplates[templateKey].title} 已生成。`,
        }),
        severity: 'success',
      });
    } catch {
      setNotice({
        message: copy({ id: 'Template gagal dibuat.', en: 'Failed to generate template.', zh: '模板生成失败。' }),
        severity: 'error',
      });
    }
  };

  const downloadExportJob = async (kind: string, name: string) => {
    try {
      const result = await api.exportData(kind);
      const { downloadXlsx } = await import('./utils/xlsx');
      downloadXlsx(`${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.xlsx`, result.rows, name.slice(0, 31));
      setNotice({
        message: copy({
          id: `${t(name)} siap diunduh dalam format XLSX.`,
          en: `${t(name)} is ready to download as XLSX.`,
          zh: `${t(name)} 可下载为 XLSX。`,
        }),
        severity: 'success',
      });
    } catch (error) {
      setNotice({
        message:
          error instanceof Error
            ? error.message
            : copy({
                id: `${t(name)} gagal diunduh.`,
                en: `Failed to download ${t(name)}.`,
                zh: `${t(name)} 下载失败。`,
              }),
        severity: 'error',
      });
    }
  };

  const operationCards = [
    {
      key: 'health' as DataOpsTab,
      label: copy({ id: 'Kesehatan data', en: 'Data health', zh: '数据健康度' }),
      value: analytics ? `${healthScore}%` : '-',
      caption: copy({
        id: `${enabledSystemCount}/${systemStatus.length || 0} layanan siap digunakan`,
        en: `${enabledSystemCount}/${systemStatus.length || 0} services are ready`,
        zh: `${enabledSystemCount}/${systemStatus.length || 0} 个服务已就绪`,
      }),
      tone: '#2fd0a8',
      icon: <CloudDoneRoundedIcon />,
    },
    {
      key: 'import' as DataOpsTab,
      label: copy({ id: 'Kanal import', en: 'Import channels', zh: '导入通道' }),
      value: String(visibleImportTemplates.length),
      caption: copy({ id: 'Template sesuai role aktif', en: 'Role-scoped templates available', zh: '按角色开放的模板' }),
      tone: '#61c8ff',
      icon: <UploadFileRoundedIcon />,
    },
    {
      key: 'export' as DataOpsTab,
      label: copy({ id: 'Export siap', en: 'Ready exports', zh: '可用导出' }),
      value: `${readyExportJobs}/${exportJobs.length || 0}`,
      caption: formatRows(totalExportRows),
      tone: '#f5c84c',
      icon: <DownloadRoundedIcon />,
    },
    {
      key: 'activity' as DataOpsTab,
      label: copy({ id: 'Perlu perhatian', en: 'Needs attention', zh: '需关注' }),
      value: analytics ? `${warningRate}%` : '-',
      caption: copy({
        id: `${formatCount(warningRows)} baris warning dari ${formatCount(submittedRows)}`,
        en: `${formatCount(warningRows)} warning rows from ${formatCount(submittedRows)}`,
        zh: `${formatCount(submittedRows)} 条中有 ${formatCount(warningRows)} 条预警`,
      }),
      tone: '#ff8b73',
      icon: <WarningAmberRoundedIcon />,
    },
  ];

  const readinessChecks = [
    {
      label: copy({ id: 'Integritas sistem', en: 'System integrity', zh: '系统完整性' }),
      value: analytics ? `${healthScore}%` : '-',
      caption: copy({ id: 'Database, master wilayah, dan notifikasi', en: 'Database, territory master, and notifications', zh: '数据库、区域主数据和通知' }),
      tone: '#2fd0a8',
    },
    {
      label: copy({ id: 'Valid rate survey', en: 'Survey valid rate', zh: '调研有效率' }),
      value: analytics ? `${validRate}%` : '-',
      caption: copy({ id: 'Data yang sudah disetujui verifikator', en: 'Rows approved by verifiers', zh: '已由审核员批准的数据' }),
      tone: '#61c8ff',
    },
    {
      label: copy({ id: 'Warning load', en: 'Warning load', zh: '预警负载' }),
      value: analytics ? `${warningRate}%` : '-',
      caption: copy({ id: 'Semakin rendah semakin siap dipakai', en: 'Lower means more production-ready', zh: '越低越适合生产使用' }),
      tone: warningRate > 25 ? '#ff8b73' : '#f5c84c',
    },
    {
      label: copy({ id: 'Foto evidence lengkap', en: 'Complete photo evidence', zh: '照片证据完整' }),
      value: analytics ? `${Math.round(metrics?.photoEvidenceComplete ?? 0)}%` : '-',
      caption: copy({ id: 'Foto depan, interior/rak, dan PIC', en: 'Front, interior/shelf, and PIC photos', zh: '门头、店内/货架和联系人照片' }),
      tone: '#8ea0ff',
    },
  ];

  const guardrails = [
    {
      title: copy({ id: 'Template resmi', en: 'Official templates', zh: '官方模板' }),
      body: copy({
        id: 'Setiap import memakai header baku agar validasi backend konsisten dan tidak bergantung pada urutan kolom manual.',
        en: 'Every import uses fixed headers so backend validation stays consistent and does not depend on manual column order.',
        zh: '每次导入都使用固定表头，使后端校验保持一致，不依赖人工列顺序。',
      }),
      icon: <FactCheckRoundedIcon />,
    },
    {
      title: copy({ id: 'Akses sesuai role', en: 'Role-scoped access', zh: '按角色授权' }),
      body: copy({
        id: 'Template dan export hanya menampilkan pekerjaan yang relevan dengan role pengguna aktif.',
        en: 'Templates and exports only show work relevant to the active user role.',
        zh: '模板和导出仅显示与当前用户角色相关的工作。',
      }),
      icon: <AdminPanelSettingsRoundedIcon />,
    },
    {
      title: copy({ id: 'Export terukur', en: 'Measured exports', zh: '可衡量导出' }),
      body: copy({
        id: 'Setiap job menampilkan scope, jumlah baris, pemilik, dan waktu selesai sebelum file diunduh.',
        en: 'Each job shows scope, row count, owner, and completion time before the file is downloaded.',
        zh: '每个任务在下载前显示范围、行数、负责人和完成时间。',
      }),
      icon: <TipsAndUpdatesRoundedIcon />,
    },
  ];

  return (
    <Stack spacing={2.6} className="data-ops-page">
      <Paper className="section-panel data-ops-hero">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} gap={2}>
          <Box minWidth={0}>
            <Typography variant="overline" color="primary.main" fontWeight={900}>
              {copy({ id: 'OPERASI DATA', en: 'DATA OPERATIONS', zh: '数据运营' })}
            </Typography>
            <Typography variant="h4" className="data-ops-title">
              {copy({
                id: 'Kontrol import, validasi, dan export campaign',
                en: 'Control import, validation, and campaign exports',
                zh: '管理导入、校验和活动导出',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={760}>
              {copy({
                id: 'Menu ini dirapikan sebagai pusat operasi data: status sistem terlihat jelas, import mengikuti template resmi, export mudah difilter, dan hasil aktivitas terakhir bisa langsung diaudit.',
                en: 'This menu is now a data operations hub: system status is visible, imports follow official templates, exports are easy to filter, and recent activity can be audited quickly.',
                zh: '该菜单现在是数据运营中心：系统状态清晰可见，导入遵循官方模板，导出便于筛选，近期活动可快速审计。',
              })}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Chip size="small" color={healthScore >= 80 ? 'success' : 'warning'} label={`${copy({ id: 'Health', en: 'Health', zh: '健康度' })} ${analytics ? `${healthScore}%` : '-'}`} />
            <Chip size="small" variant="outlined" label={`${copy({ id: 'Role', en: 'Role', zh: '角色' })}: ${t(role)}`} />
            <Button size="small" variant="contained" startIcon={<RestartAltRoundedIcon />} disabled={refreshing} onClick={() => void refreshAnalytics()}>
              {refreshing ? copy({ id: 'Memuat...', en: 'Refreshing...', zh: '刷新中...' }) : copy({ id: 'Refresh status', en: 'Refresh status', zh: '刷新状态' })}
            </Button>
          </Stack>
        </Stack>
        <Box className="data-ops-healthbar" aria-label={copy({ id: 'Skor kesehatan operasi data', en: 'Data operations health score', zh: '数据运营健康分' })}>
          <Box className="data-ops-healthbar-fill" sx={{ width: `${analytics ? healthScore : 0}%` }} />
        </Box>
        {!analytics && <LinearProgress />}
      </Paper>

      <Box className="data-ops-metric-grid">
        {operationCards.map((card) => (
          <Paper
            key={card.key}
            className={`data-ops-metric-card ${activeOpsTab === card.key ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveOpsTab(card.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setActiveOpsTab(card.key);
              }
            }}
            style={{ '--metric-tone': card.tone } as React.CSSProperties}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
              <Box minWidth={0}>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography className="data-ops-metric-value">{card.value}</Typography>
              </Box>
              <Box className="data-ops-metric-icon">{card.icon}</Box>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {card.caption}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper className="section-panel data-ops-workbench">
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} gap={1.5}>
            <SectionTitle
              icon={<SettingsRoundedIcon />}
              title={copy({ id: 'Workbench Operasi Data', en: 'Data Operations Workbench', zh: '数据运营工作台' })}
            />
            <Tabs
              className="data-ops-tabs"
              value={activeOpsTab}
              onChange={(_, value: DataOpsTab) => setActiveOpsTab(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="health" label={copy({ id: 'Health', en: 'Health', zh: '健康' })} />
              <Tab value="import" label={copy({ id: 'Import', en: 'Import', zh: '导入' })} />
              <Tab value="export" label={copy({ id: 'Export', en: 'Export', zh: '导出' })} />
              <Tab value="activity" label={copy({ id: 'Aktivitas', en: 'Activity', zh: '活动' })} />
            </Tabs>
          </Stack>

          {activeOpsTab === 'health' && (
            <Box className="data-ops-health-layout">
              <Stack spacing={1.2}>
                {systemStatus.map(({ label, enabled, detail }) => (
                  <Paper key={label} className="data-ops-status-row">
                    <Stack direction="row" spacing={1.4} alignItems="center" minWidth={0}>
                      <Box className={`data-ops-status-icon ${enabled ? 'ready' : 'attention'}`}>
                        {enabled ? <CheckCircleRoundedIcon /> : <WarningAmberRoundedIcon />}
                      </Box>
                      <Box minWidth={0}>
                        <Typography fontWeight={900}>{t(label)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatSystemDetail(label, detail)}
                        </Typography>
                      </Box>
                    </Stack>
                    <Switch checked={enabled} disabled />
                  </Paper>
                ))}
                {!systemStatus.length && <Alert severity="info">{copy({ id: 'Status sistem sedang dimuat.', en: 'System status is loading.', zh: '系统状态加载中。' })}</Alert>}
              </Stack>
              <Paper className="data-ops-readiness-panel">
                <Typography fontWeight={900}>{copy({ id: 'Kesiapan production', en: 'Production readiness', zh: '生产就绪度' })}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {copy({
                    id: 'Indikator ini membantu melihat apakah pipeline data sudah cukup bersih untuk keputusan harian.',
                    en: 'These indicators show whether the data pipeline is clean enough for daily decisions.',
                    zh: '这些指标用于判断数据管道是否足够干净，可支持日常决策。',
                  })}
                </Typography>
                <Stack spacing={1.1} mt={1.5}>
                  {readinessChecks.map((item) => (
                    <Box key={item.label} className="data-ops-readiness-row" style={{ '--readiness-tone': item.tone } as React.CSSProperties}>
                      <Stack direction="row" justifyContent="space-between" gap={1}>
                        <Typography fontWeight={900}>{item.label}</Typography>
                        <Typography fontWeight={900}>{item.value}</Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {item.caption}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}

          {activeOpsTab === 'import' && (
            <Stack spacing={1.6}>
              <Alert severity="info" variant="outlined">
                {copy({
                  id: 'Import hanya menerima file .xlsx dari template resmi. Kolom wajib ditampilkan agar operator bisa memeriksa struktur sebelum upload.',
                  en: 'Imports only accept .xlsx files from official templates. Required columns are shown so operators can check structure before uploading.',
                  zh: '导入仅接受官方模板生成的 .xlsx 文件。系统会显示必填列，便于操作员上传前核对结构。',
                })}
              </Alert>
              <Box className="data-ops-import-grid">
                {visibleImportTemplates.map((item) => {
                  const template = importTemplates[item];
                  return (
                    <Paper key={item} className="data-ops-import-card">
                      <Stack spacing={1.4} height="100%">
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.2}>
                          <Box minWidth={0}>
                            <Typography fontWeight={900}>{t(template.title)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {template.filename}
                            </Typography>
                          </Box>
                          <Box className="data-ops-import-icon">
                            <UploadFileRoundedIcon />
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.8} flexWrap="wrap">
                          {template.roles.map((templateRole) => (
                            <Chip key={templateRole} size="small" variant="outlined" label={t(templateRole)} />
                          ))}
                        </Stack>
                        <Box className="data-ops-column-preview">
                          <Typography variant="caption" color="text.secondary" fontWeight={900}>
                            {copy({ id: 'Kolom wajib', en: 'Required columns', zh: '必填列' })}
                          </Typography>
                          <Typography variant="body2">{template.headers.slice(0, 5).join(', ')}</Typography>
                          {template.headers.length > 5 && (
                            <Typography variant="caption" color="text.secondary">
                              +{template.headers.length - 5} {copy({ id: 'kolom lain', en: 'more columns', zh: '个其他列' })}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1} mt="auto">
                          <Button variant="contained" startIcon={<UploadFileRoundedIcon />} onClick={() => setImportDialog(item)}>
                            {copy({ id: 'Import', en: 'Import', zh: '导入' })}
                          </Button>
                          <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={() => void downloadImportTemplate(item)}>
                            {copy({ id: 'Template', en: 'Template', zh: '模板' })}
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  );
                })}
                {!visibleImportTemplates.length && (
                  <Alert severity="warning">{copy({ id: 'Import tidak tersedia untuk role ini.', en: 'Import is not available for this role.', zh: '该角色无导入权限。' })}</Alert>
                )}
              </Box>
            </Stack>
          )}

          {activeOpsTab === 'export' && (
            <Stack spacing={1.6}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1.2}>
                <TextField
                  size="small"
                  value={exportSearch}
                  onChange={(event) => setExportSearch(event.target.value)}
                  label={copy({ id: 'Cari export', en: 'Search exports', zh: '搜索导出' })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: { md: 320 } }}
                />
                <TextField
                  select
                  size="small"
                  value={exportStatusFilter}
                  onChange={(event) => setExportStatusFilter(event.target.value as 'all' | 'Ready' | 'Processing')}
                  label={copy({ id: 'Status', en: 'Status', zh: '状态' })}
                  sx={{ minWidth: { md: 180 } }}
                >
                  <MenuItem value="all">{copy({ id: 'Semua status', en: 'All statuses', zh: '全部状态' })}</MenuItem>
                  <MenuItem value="Ready">{copy({ id: 'Ready', en: 'Ready', zh: '就绪' })}</MenuItem>
                  <MenuItem value="Processing">{copy({ id: 'Processing', en: 'Processing', zh: '处理中' })}</MenuItem>
                </TextField>
              </Stack>
              <Table size="small" className="data-ops-export-table">
                <TableHead>
                  <TableRow>
                    <TableCell>{copy({ id: 'Export', en: 'Export', zh: '导出' })}</TableCell>
                    <TableCell>{copy({ id: 'Scope', en: 'Scope', zh: '范围' })}</TableCell>
                    <TableCell>{copy({ id: 'Baris', en: 'Rows', zh: '行数' })}</TableCell>
                    <TableCell>{copy({ id: 'Status', en: 'Status', zh: '状态' })}</TableCell>
                    <TableCell>{copy({ id: 'Selesai', en: 'Completed', zh: '完成时间' })}</TableCell>
                    <TableCell align="right">{copy({ id: 'Aksi', en: 'Action', zh: '操作' })}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExportJobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell>
                        <Typography fontWeight={900}>{t(job.name)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(job.ownerRole)}
                        </Typography>
                      </TableCell>
                      <TableCell>{job.scope}</TableCell>
                      <TableCell>{formatCount(job.rowCount)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={t(job.status)} color={job.status === 'Ready' ? 'success' : 'warning'} variant="outlined" />
                      </TableCell>
                      <TableCell>{formatDateTime(job.completedAt || job.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="contained" startIcon={<DownloadRoundedIcon />} onClick={() => void downloadExportJob(job.kind, job.name)}>
                          {copy({ id: 'Unduh', en: 'Download', zh: '下载' })}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Stack spacing={1.2} className="data-ops-export-card-list">
                {filteredExportJobs.map((job) => (
                  <Paper key={job.id} className="data-ops-export-card">
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Box minWidth={0}>
                          <Typography fontWeight={900}>{t(job.name)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.scope} - {t(job.ownerRole)} - {formatRows(job.rowCount)}
                          </Typography>
                        </Box>
                        <Chip size="small" label={t(job.status)} color={job.status === 'Ready' ? 'success' : 'warning'} variant="outlined" />
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(job.completedAt || job.createdAt)}
                        </Typography>
                        <Button size="small" variant="contained" startIcon={<DownloadRoundedIcon />} onClick={() => void downloadExportJob(job.kind, job.name)}>
                          {copy({ id: 'Unduh', en: 'Download', zh: '下载' })}
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
              {!filteredExportJobs.length && (
                <Alert severity="info">{copy({ id: 'Tidak ada export yang cocok dengan filter.', en: 'No exports match the current filter.', zh: '没有符合筛选条件的导出。' })}</Alert>
              )}
            </Stack>
          )}

          {activeOpsTab === 'activity' && (
            <Box className="data-ops-activity-layout">
              <Paper className="data-ops-activity-card">
                <Stack spacing={1.4}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Box>
                      <Typography fontWeight={900}>{copy({ id: 'Import terakhir sesi ini', en: 'Latest import in this session', zh: '本会话最近导入' })}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {copy({ id: 'Ditampilkan setelah operator menjalankan import dari menu ini.', en: 'Shown after an operator runs an import from this menu.', zh: '操作员从本菜单执行导入后显示。' })}
                      </Typography>
                    </Box>
                    <Chip size="small" color={lastImportResult ? lastImportSeverity : 'default'} label={lastImportResult ? t(lastImportResult.kind) : '-'} />
                  </Stack>
                  {lastImportResult ? (
                    <>
                      <Typography fontWeight={900}>{lastImportResult.fileName}</Typography>
                      <Box className="data-ops-import-result-grid">
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {copy({ id: 'Diproses', en: 'Processed', zh: '已处理' })}
                          </Typography>
                          <Typography fontWeight={900}>{formatCount(lastImportResult.processedRows)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {copy({ id: 'Dibuat', en: 'Created', zh: '已创建' })}
                          </Typography>
                          <Typography fontWeight={900}>{formatCount(lastImportResult.created)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {copy({ id: 'Dilewati', en: 'Skipped', zh: '已跳过' })}
                          </Typography>
                          <Typography fontWeight={900}>{formatCount(lastImportResult.skipped)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Error
                          </Typography>
                          <Typography fontWeight={900}>{formatCount(lastImportResult.errors.length)}</Typography>
                        </Box>
                      </Box>
                      {lastImportResult.errors.length > 0 && (
                        <Alert severity="warning" variant="outlined">
                          <Stack spacing={0.5}>
                            {lastImportResult.errors.slice(0, 4).map((item, index) => (
                              <Typography key={`${item}-${index}`} variant="caption">
                                {item}
                              </Typography>
                            ))}
                          </Stack>
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert severity="info">{copy({ id: 'Belum ada import pada sesi ini.', en: 'No import has run in this session yet.', zh: '本会话尚未执行导入。' })}</Alert>
                  )}
                </Stack>
              </Paper>
              <Paper className="data-ops-activity-card">
                <Stack spacing={1.4}>
                  <Typography fontWeight={900}>{copy({ id: 'Export terbaru', en: 'Latest export', zh: '最近导出' })}</Typography>
                  {latestExport ? (
                    <>
                      <Box>
                        <Typography fontWeight={900}>{t(latestExport.name)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {latestExport.scope} - {formatRows(latestExport.rowCount)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip size="small" color={latestExport.status === 'Ready' ? 'success' : 'warning'} label={t(latestExport.status)} />
                        <Chip size="small" variant="outlined" label={formatDateTime(latestExport.completedAt || latestExport.createdAt)} />
                      </Stack>
                      <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={() => void downloadExportJob(latestExport.kind, latestExport.name)}>
                        {copy({ id: 'Unduh export terbaru', en: 'Download latest export', zh: '下载最近导出' })}
                      </Button>
                    </>
                  ) : (
                    <Alert severity="info">{copy({ id: 'Belum ada job export dari backend.', en: 'There are no backend export jobs yet.', zh: '后端暂无导出任务。' })}</Alert>
                  )}
                </Stack>
              </Paper>
              <Stack spacing={1.2}>
                {guardrails.map((item) => (
                  <Paper key={item.title} className="data-ops-guardrail-card">
                    <Box className="data-ops-guardrail-icon">{item.icon}</Box>
                    <Box>
                      <Typography fontWeight={900}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.body}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      <ImportXlsxDialog
        open={Boolean(importDialog)}
        templateKey={importDialog ?? 'User import'}
        onClose={() => setImportDialog(null)}
        submitting={importSubmitting}
        onSubmit={async (file) => {
          const activeImport = importDialog;
          if (!activeImport) return;
          setImportSubmitting(true);
          try {
            const { fileToBase64 } = await import('./utils/xlsx');
            const dataBase64 = await fileToBase64(file);
            const response = await api.importXlsx(importTemplates[activeImport].kind, { fileName: file.name, dataBase64 });
            setImportDialog(null);
            setLastImportResult(response.result);
            setActiveOpsTab('activity');
            setNotice({
              message: copy({
                id: `${file.name} diproses: ${formatCount(response.result.created)} dibuat, ${formatCount(response.result.skipped)} dilewati, ${formatCount(response.result.errors.length)} error.`,
                en: `${file.name} processed: ${formatCount(response.result.created)} created, ${formatCount(response.result.skipped)} skipped, ${formatCount(response.result.errors.length)} errors.`,
                zh: `${file.name} 已处理：创建 ${formatCount(response.result.created)}，跳过 ${formatCount(response.result.skipped)}，错误 ${formatCount(response.result.errors.length)}。`,
              }),
              severity: response.result.errors.length ? 'warning' : 'success',
            });
            void refreshAnalytics(false);
          } catch (error) {
            setNotice({
              message:
                error instanceof Error
                  ? error.message
                  : copy({
                      id: `${file.name} gagal diproses.`,
                      en: `${file.name} failed to process.`,
                      zh: `${file.name} 处理失败。`,
                    }),
              severity: 'error',
            });
          } finally {
            setImportSubmitting(false);
          }
        }}
      />
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

type UserFormState = {
  id?: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  role: '' | Role;
  managerId: string;
  status: '' | AppUser['status'];
};

const emptyUserForm: UserFormState = {
  name: '',
  username: '',
  password: '',
  phone: '',
  role: '',
  managerId: '',
  status: '',
};

function UsersPage() {
  const language = useCurrentLanguage();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
  const [userError, setUserError] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const managers = useMemo(() => users.filter((user) => user.role === 'Manager'), [users]);
  const userStats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === 'Active').length,
      inactive: users.filter((user) => user.status === 'Inactive').length,
    }),
    [users],
  );

  useEffect(() => {
    api
      .users()
      .then((result) => setUsers(result.users))
      .catch((error) => setUserError(error instanceof Error ? error.message : 'Failed to load users'));
  }, []);

  const openAddDialog = () => {
    setUserForm(emptyUserForm);
    setDialogMode('add');
  };

  const openEditDialog = (user: AppUser) => {
    setUserForm({
      id: user.id,
      name: user.name,
      username: user.username,
      password: '',
      phone: user.phone,
      role: user.role,
      managerId: user.managerId || managers[0]?.id || '',
      status: user.status,
    });
    setDialogMode('edit');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setUserForm(emptyUserForm);
  };

  const saveUser = async () => {
    if (
      !userForm.name.trim() ||
      !userForm.username.trim() ||
      !userForm.phone.trim() ||
      !userForm.role ||
      !userForm.status ||
      (dialogMode === 'add' && !userForm.password.trim())
    )
      return;
    if (userForm.role === 'Surveyor' && !userForm.managerId) return;

    setSavingUser(true);
    setUserError('');
    try {
      if (dialogMode === 'add') {
        const result = await api.createUser({
          name: userForm.name,
          username: userForm.username,
          password: userForm.password,
          phone: userForm.phone,
          role: userForm.role,
          managerId: userForm.role === 'Surveyor' ? userForm.managerId : undefined,
          status: userForm.status,
        });
        setUsers((currentUsers) => [...currentUsers, result.user]);
        setNotice({ message: `${result.user.name} berhasil ditambahkan.`, severity: 'success' });
      }

      if (dialogMode === 'edit' && userForm.id) {
        const result = await api.updateUser(userForm.id, {
          name: userForm.name,
          username: userForm.username,
          password: userForm.password || undefined,
          phone: userForm.phone,
          role: userForm.role,
          managerId: userForm.role === 'Surveyor' ? userForm.managerId : undefined,
          status: userForm.status,
        });
        setUsers((currentUsers) => currentUsers.map((user) => (user.id === userForm.id ? result.user : user)));
        setNotice({ message: `${result.user.name} berhasil diperbarui.`, severity: 'success' });
      }

      closeDialog();
    } catch (error) {
      setUserError(error instanceof Error ? error.message : 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find((item) => item.id === id);
    if (!user) return;
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.setUserStatus(id, nextStatus);
      setUsers((currentUsers) => currentUsers.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
      setNotice({ message: `${user.name} sekarang ${nextStatus}.`, severity: 'success' });
    } catch (error) {
      setUserError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const deleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteUser(deleteTarget.id);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== deleteTarget.id));
      setNotice({ message: `${deleteTarget.name} berhasil dihapus.`, severity: 'success' });
      setDeleteTarget(null);
    } catch (error) {
      setUserError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  return (
    <Stack spacing={3}>
      <Box className="metric-grid three">
        <ScoreBadge label="Total Users" value={String(userStats.total)} caption="Registered Polibeli accounts" tone="#61c8ff" />
        <ScoreBadge label="Active Users" value={String(userStats.active)} caption="Can access campaign app" tone="#2fd0a8" />
        <ScoreBadge label="Inactive Users" value={String(userStats.inactive)} caption="Login access disabled" tone="#ff8b73" />
      </Box>

      <Paper className="section-panel">
        <SectionTitle
          icon={<ManageAccountsRoundedIcon />}
          title="User Access Management"
          action={
            <Button variant="contained" startIcon={<PersonAddAltRoundedIcon />} onClick={openAddDialog}>
              Add User
            </Button>
          }
        />
        {userError && (
          <Chip
            color="error"
            icon={<WarningAmberRoundedIcon />}
            label={userError}
            sx={{ mb: 2, justifyContent: 'flex-start', minHeight: 40 }}
          />
        )}
        <Table size="small" className="users-table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const manager = users.find((item) => item.id === user.managerId);

              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar>{user.name.slice(0, 1)}</Avatar>
                      <Box>
                        <Typography fontWeight={900}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip size="small" label="Reset only" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={user.role} />
                  </TableCell>
                  <TableCell>{user.role === 'Surveyor' ? manager?.name ?? 'Unassigned' : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.status}
                      color={user.status === 'Active' ? 'success' : 'default'}
                      variant={user.status === 'Active' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={localCopy(language, { id: 'Buka detail dan edit data user.', en: 'Open user details and edit their data.', zh: '打开用户详情并编辑数据。' })}>
                      <IconButton aria-label={`Edit ${user.name}`} onClick={() => openEditDialog(user)}>
                        <MoreVertRoundedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        user.status === 'Active'
                          ? localCopy(language, { id: 'Nonaktifkan akses user tanpa menghapus datanya.', en: 'Deactivate this user without deleting their data.', zh: '停用该用户访问权限，但不删除其数据。' })
                          : localCopy(language, { id: 'Aktifkan kembali akses user ini.', en: "Reactivate this user's access.", zh: '重新启用该用户访问权限。' })
                      }
                    >
                      <IconButton aria-label={`${user.status === 'Active' ? 'Deactivate' : 'Activate'} ${user.name}`} onClick={() => toggleUserStatus(user.id)}>
                        <BlockRoundedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={localCopy(language, { id: 'Hapus user ini setelah konfirmasi.', en: 'Delete this user after confirmation.', zh: '确认后删除该用户。' })}>
                      <IconButton aria-label={`Delete ${user.name}`} color="error" onClick={() => setDeleteTarget(user)}>
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Stack spacing={1.2} className="user-card-list">
          {users.map((user) => {
            const manager = users.find((item) => item.id === user.managerId);

            return (
              <Paper key={user.id} className="user-card">
                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar>{user.name.slice(0, 1)}</Avatar>
                    <Box minWidth={0} flex={1}>
                      <Typography fontWeight={900}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.username} - {user.phone}
                      </Typography>
                    </Box>
                    <Chip size="small" label={user.status} color={user.status === 'Active' ? 'success' : 'default'} />
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip size="small" label={user.role} variant="outlined" />
                    <Chip size="small" label={user.role === 'Surveyor' ? manager?.name ?? 'Unassigned manager' : 'No manager required'} variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" className="user-password-row">
                    <Typography variant="caption" color="text.secondary">
                      Password
                    </Typography>
                    <Chip size="small" label="Reset only" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button size="small" variant="outlined" startIcon={<MoreVertRoundedIcon />} onClick={() => openEditDialog(user)}>
                      Detail
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<BlockRoundedIcon />} onClick={() => toggleUserStatus(user.id)}>
                      {user.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteRoundedIcon />} onClick={() => setDeleteTarget(user)}>
                      Hapus
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Paper>

      <UserDialog
        mode={dialogMode}
        userForm={userForm}
        managers={managers}
        onClose={closeDialog}
        onSave={saveUser}
        onChange={setUserForm}
        saving={savingUser}
      />
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hapus user {deleteTarget?.name}? Akses login user ini akan hilang dari database aplikasi.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" startIcon={<DeleteRoundedIcon />} onClick={deleteUser}>
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

function UserDialog({
  mode,
  userForm,
  managers,
  onClose,
  onSave,
  onChange,
  saving,
}: {
  mode: 'add' | 'edit' | null;
  userForm: UserFormState;
  managers: AppUser[];
  onClose: () => void;
  onSave: () => void;
  onChange: React.Dispatch<React.SetStateAction<UserFormState>>;
  saving: boolean;
}) {
  const isOpen = mode !== null;
  const isSurveyor = userForm.role === 'Surveyor';
  const isInvalid =
    !userForm.name.trim() ||
    !userForm.username.trim() ||
    (mode === 'add' && !userForm.password.trim()) ||
    !userForm.phone.trim() ||
    !userForm.role ||
    !userForm.status ||
    (isSurveyor && !userForm.managerId);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: 'solid-dialog-paper',
        style: {
          backgroundColor: '#07100f',
          backgroundImage: 'none',
          opacity: 1,
        },
      }}
    >
      <DialogTitle>{mode === 'add' ? 'Add User' : 'Detail User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} pt={1}>
          <TextField
            label="Full Name"
            value={userForm.name}
            onChange={(event) => onChange((current) => ({ ...current, name: event.target.value }))}
            fullWidth
          />
          <TextField
            label="Username"
            value={userForm.username}
            onChange={(event) => onChange((current) => ({ ...current, username: event.target.value }))}
            fullWidth
          />
          <TextField
            label="Password"
            value={userForm.password}
            onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
            helperText={mode === 'edit' ? 'Leave blank to keep current password, or type a new one.' : 'Set initial password for this user.'}
            fullWidth
          />
          <TextField
            label="Phone Number"
            value={userForm.phone}
            onChange={(event) => onChange((current) => ({ ...current, phone: event.target.value }))}
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={userForm.role}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                role: event.target.value as UserFormState['role'],
                managerId: event.target.value === 'Surveyor' ? current.managerId : '',
              }))
            }
            fullWidth
          >
            <MenuItem value="">
              <em>Pilih role</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          {isSurveyor && (
            <TextField
              select
              required
              label="Manager"
              value={userForm.managerId}
              onChange={(event) => onChange((current) => ({ ...current, managerId: event.target.value }))}
              helperText="Required for Surveyor accounts."
              fullWidth
            >
              <MenuItem value="">
                <em>Pilih manager</em>
              </MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField
            select
            label="Status"
            value={userForm.status}
            onChange={(event) => onChange((current) => ({ ...current, status: event.target.value as UserFormState['status'] }))}
            fullWidth
          >
            <MenuItem value="">
              <em>Pilih status</em>
            </MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={isInvalid || saving}>
          {saving ? 'Saving...' : mode === 'add' ? 'Add User' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SectionTitle({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} spacing={2} className="section-title-row">
      <Stack direction="row" spacing={1.2} alignItems="center" minWidth={0}>
        <Avatar className="section-icon">{icon}</Avatar>
        <Typography variant="h6" className="section-title-text">
          {title}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
}

type BarTooltipContext = 'lead' | 'brand' | 'default';

function barCategoryExplanation(label: string, context: BarTooltipContext, language: AppLanguage) {
  const normalized = label.toLowerCase();
  if (/hot lead/.test(normalized)) {
    return localCopy(language, {
      id: `${label} adalah toko dengan Merchant Potential tinggi, terbuka mencoba supplier baru, dan nomor WhatsApp yang sudah ditandai reachable oleh verifikator.`,
      en: `${label} is a store with high Merchant Potential, openness to trying a new supplier, and a WhatsApp number marked reachable by the verifier.`,
      zh: `${label} 是商户潜力高、愿意尝试新供应商且有 WhatsApp 的门店，因此 KLWT 或经销商团队可以直接跟进。`,
    });
  }
  if (/qualified lead/.test(normalized)) {
    return localCopy(language, {
      id: `${label} adalah toko dengan Merchant Potential tinggi dan terbuka mencoba supplier baru, tetapi WhatsApp belum siap dipakai untuk follow-up langsung.`,
      en: `${label} is a store with high Merchant Potential and openness to trying a new supplier, but WhatsApp is not ready for direct follow-up yet.`,
      zh: `${label} 是商户潜力高且愿意尝试新供应商的门店，但尚未具备可直接跟进的 WhatsApp 号码。`,
    });
  }
  if (/strategic lead|strategis/.test(normalized)) {
    return localCopy(language, {
      id: `${label} adalah toko dengan relevansi cooling yang kuat, misalnya produk atau aktivitas penjualan cooling terlihat jelas, tetapi openness terhadap supplier baru belum cukup tinggi.`,
      en: `${label} is a store with strong cooling relevance, such as visible cooling products or sales activity, but openness to a new supplier is not high enough yet.`,
      zh: `${label} 是冷却品类相关性较强的门店，例如产品或销售活动明显，但对新供应商的开放度尚不够高。`,
    });
  }
  if (/normal lead|lead normal/.test(normalized)) {
    return localCopy(language, {
      id: `${label} adalah toko yang masih relevan untuk dipantau, tetapi sinyal cooling, potensi beli, openness, atau contactability belum cukup kuat untuk prioritas tinggi.`,
      en: `${label} is a store still worth monitoring, but its cooling, purchase-potential, openness, or contactability signals are not strong enough for high priority.`,
      zh: `${label} 是仍值得关注的门店，但冷却品类、采购潜力、开放度或可联系性信号尚不足以列为高优先级。`,
    });
  }
  if (/low priority|prioritas rendah/.test(normalized)) {
    return localCopy(language, {
      id: `${label} adalah toko dengan relevansi atau kesiapan follow-up yang rendah, misalnya tidak terlalu fokus pada cooling atau belum terbuka mencoba supplier baru.`,
      en: `${label} is a store with low relevance or follow-up readiness, for example not strongly focused on cooling or not open to trying a new supplier yet.`,
      zh: `${label} 是相关性或跟进准备度较低的门店，例如冷却品类不强或尚未愿意尝试新供应商。`,
    });
  }
  if (context === 'brand') {
    return localCopy(language, {
      id: `${label} adalah brand cooling yang tercatat terlihat atau dijual di toko saat survey. Data ini membantu membaca brand mana yang paling sering muncul di pasar.`,
      en: `${label} is a cooling brand recorded as seen or sold in stores during the survey. This helps show which brands appear most often in the market.`,
      zh: `${label} 是调研中记录到在门店可见或销售的冷却品牌。该数据用于了解市场中最常出现的品牌。`,
    });
  }
  if (context === 'lead') {
    return localCopy(language, {
      id: `${label} adalah klasifikasi lead hasil scoring survey. Klasifikasi ini memakai Merchant Potential, relevansi cooling, openness terhadap supplier baru, dan kesiapan kontak follow-up.`,
      en: `${label} is a lead classification produced by survey scoring. It uses Merchant Potential, cooling relevance, openness to a new supplier, and follow-up contact readiness.`,
      zh: `${label} 是由调研评分产生的线索分类，基于商户潜力、冷却品类相关性、对新供应商的开放度和跟进联系方式准备度。`,
    });
  }
  return localCopy(language, {
    id: `${label} adalah kategori data pada chart ini. Angkanya menunjukkan berapa banyak record backend yang masuk kategori tersebut pada scope aktif.`,
    en: `${label} is a data category in this chart. The number shows how many backend records fall into this category in the active scope.`,
    zh: `${label} 是该图表中的数据类别。数值表示当前范围内有多少后端记录属于该类别。`,
  });
}

function barTooltipTitleV2(row: { label: string; value: number; color: string }, sharePercent: number, context: BarTooltipContext, language: AppLanguage) {
  return (
    <Box className="explain-tooltip-content">
      <Typography variant="caption" fontWeight={900}>
        {row.label}
      </Typography>
      <Typography variant="caption">{barCategoryExplanation(row.label, context, language)}</Typography>
      <Typography variant="caption">
        {localCopy(language, {
          id: `Jumlah ${row.label} ${row.value.toLocaleString('id-ID')} atau ${sharePercent}% dari jumlah keseluruhan.`,
          en: `${row.label} count is ${row.value.toLocaleString('id-ID')}, or ${sharePercent}% of the total.`,
          zh: `${row.label} 数量为 ${row.value.toLocaleString('id-ID')}，占总数的 ${sharePercent}%。`,
        })}
      </Typography>
    </Box>
  );
}

function barTooltipTitle(row: { label: string; value: number; color: string }, percent: number, language: AppLanguage) {
  return (
    <Box className="explain-tooltip-content">
      <Typography variant="caption" fontWeight={900}>
        {row.label}
      </Typography>
      <Typography variant="caption">
        {localCopy(language, { id: 'Jumlah data', en: 'Data count', zh: '数据量' })}: {row.value.toLocaleString('id-ID')}
      </Typography>
      <Typography variant="caption">
        {localCopy(language, { id: 'Panjang bar', en: 'Bar length', zh: '条形长度' })}: {percent}% {localCopy(language, { id: 'dari kategori tertinggi', en: 'of the top category', zh: '相对于最高类别' })}
      </Typography>
      <Typography variant="caption">
        {localCopy(language, {
          id: 'Semakin panjang bar, semakin besar kontribusi kategori ini dibanding kategori lain pada chart yang sama.',
          en: 'A longer bar means this category contributes more than other categories in the same chart.',
          zh: '条形越长，表示该类别在同一图表中贡献越高。',
        })}
      </Typography>
    </Box>
  );
}

function BarList({ rows, max, context = 'default' }: { rows: { label: string; value: number; color: string }[]; max: number; context?: BarTooltipContext }) {
  const language = useCurrentLanguage();
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (
    <Stack spacing={1.5}>
      {rows.map((row) => {
        const percent = Math.round((row.value / max) * 100);
        const sharePercent = total ? Math.round((row.value / total) * 100) : 0;
        return (
          <Tooltip key={row.label} arrow placement="top" title={barTooltipTitleV2(row, sharePercent, context, language)} slotProps={{ tooltip: { className: 'explain-tooltip' } }}>
            <Stack className="bar-row" spacing={0.6} sx={{ '--bar-color': row.color } as React.CSSProperties}>
              <Stack direction="row" justifyContent="space-between" gap={1}>
                <Typography fontWeight={800}>{row.label}</Typography>
                <Typography color="text.secondary">{row.value}</Typography>
              </Stack>
              <Box className="bar-track">
                <Box className="bar-fill" sx={{ width: `${percent}%`, bgcolor: row.color }} />
              </Box>
            </Stack>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function donutSlicePath(cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const safeEndAngle = Math.min(endAngle, startAngle + 359.95);
  const largeArcFlag = safeEndAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, safeEndAngle);
  const innerStart = polarPoint(cx, cy, innerRadius, safeEndAngle);
  const innerEnd = polarPoint(cx, cy, innerRadius, startAngle);
  return [
    `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
    `L ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function LeadDonutChart({ rows }: { rows: { label: string; value: number; color: string }[] }) {
  const language = useCurrentLanguage();
  const [hoveredLabel, setHoveredLabel] = useState('');
  const slices = rows.filter((row) => row.value > 0);
  const total = slices.reduce((sum, row) => sum + row.value, 0);
  const selectedRow = hoveredLabel ? slices.find((row) => row.label === hoveredLabel) ?? null : null;
  const selectedPercent = selectedRow && total ? Math.round((selectedRow.value / total) * 100) : 0;

  if (!total) {
    return (
      <Box className="history-empty-card">
        <Typography fontWeight={900}>Belum ada klasifikasi lead.</Typography>
        <Typography variant="body2" color="text.secondary">
          Donut chart akan muncul setelah data survey tersedia.
        </Typography>
      </Box>
    );
  }

  const cx = 300;
  const cy = 172;
  const baseInnerRadius = 70;
  const baseOuterRadius = 112;
  let cursorAngle = 0;

  return (
    <Stack spacing={1.4} className={`lead-donut-wrap${selectedRow ? ' is-focused' : ''}`} onMouseLeave={() => setHoveredLabel('')}>
      {selectedRow && <Box className="lead-donut-page-scrim" aria-hidden="true" />}
      <Box className="lead-donut-canvas">
        <svg viewBox="0 0 600 360" className="lead-donut-svg" role="img" aria-label="Lead classification donut chart">
          <circle className="lead-donut-center-ring" cx={cx} cy={cy} r={baseInnerRadius - 10} />
          {slices.map((row) => {
            const angle = (row.value / total) * 360;
            const startAngle = cursorAngle;
            const endAngle = cursorAngle + angle;
            cursorAngle = endAngle;
            const midAngle = startAngle + angle / 2;
            const active = hoveredLabel === row.label;
            const outerRadius = active ? baseOuterRadius + 12 : baseOuterRadius;
            const innerRadius = active ? baseInnerRadius - 2 : baseInnerRadius;
            const explode = active ? polarPoint(0, 0, 8, midAngle) : { x: 0, y: 0 };
            const labelKnee = polarPoint(cx, cy, baseOuterRadius + 18, midAngle);
            const labelAnchor = polarPoint(cx, cy, baseOuterRadius + 42, midAngle);
            const onRight = labelAnchor.x >= cx;
            const labelEndX = labelAnchor.x + (onRight ? 36 : -36);
            const percent = Math.round((row.value / total) * 100);

            return (
              <g
                key={row.label}
                className={`lead-donut-slice-group${active ? ' active' : ''}`}
                transform={`translate(${explode.x.toFixed(2)} ${explode.y.toFixed(2)})`}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredLabel(row.label)}
                onFocus={() => setHoveredLabel(row.label)}
                onBlur={() => setHoveredLabel('')}
              >
                <path
                  className="lead-donut-slice"
                  d={donutSlicePath(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
                  fill={row.color}
                  stroke="#07100f"
                  strokeWidth={2}
                />
                <polyline
                  className="lead-donut-label-line"
                  points={`${labelKnee.x.toFixed(1)},${labelKnee.y.toFixed(1)} ${labelAnchor.x.toFixed(1)},${labelAnchor.y.toFixed(1)} ${labelEndX.toFixed(1)},${labelAnchor.y.toFixed(1)}`}
                  stroke={row.color}
                />
                <text className="lead-donut-label" x={labelEndX} y={labelAnchor.y - 4} textAnchor={onRight ? 'start' : 'end'}>
                  {row.label}
                </text>
                <text className="lead-donut-label-value" x={labelEndX} y={labelAnchor.y + 12} textAnchor={onRight ? 'start' : 'end'}>
                  {row.value.toLocaleString(languageLocale(language))} ({percent}%)
                </text>
              </g>
            );
          })}
          <text className="lead-donut-center-label" x={cx} y={cy - 10} textAnchor="middle">
            Total
          </text>
          <text className="lead-donut-center-value" x={cx} y={cy + 18} textAnchor="middle">
            {total.toLocaleString(languageLocale(language))}
          </text>
        </svg>
      </Box>
      {selectedRow && (
        <Box className="lead-donut-detail" sx={{ '--lead-donut-color': selectedRow.color } as React.CSSProperties}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Box minWidth={0}>
              <Typography variant="caption" color="text.secondary">
                Slice aktif
              </Typography>
              <Typography fontWeight={950}>{selectedRow.label}</Typography>
            </Box>
            <Chip size="small" label={`${selectedPercent}%`} sx={{ bgcolor: alpha(selectedRow.color, 0.16), color: selectedRow.color }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {barCategoryExplanation(selectedRow.label, 'lead', language)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedRow.value.toLocaleString(languageLocale(language))} toko dari {total.toLocaleString(languageLocale(language))} klasifikasi lead pada scope aktif.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

function LeadMixPanel({
  summaries,
  total,
  language,
  onOpen,
}: {
  summaries: LeadMixSummary[];
  total: number;
  language: AppLanguage;
  onOpen: (label: string) => void;
}) {
  if (!total) {
    return (
      <Box className="history-empty-card">
        <Typography fontWeight={900}>Belum ada komposisi lead.</Typography>
        <Typography variant="body2" color="text.secondary">
          Data akan muncul setelah survey masuk pada filter aktif.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={0.85}>
      <Stack spacing={0.85} className="lead-mix-list">
        {summaries.map((summary) => (
          <Box
            key={summary.label}
            className="lead-mix-row"
            role="button"
            tabIndex={0}
            sx={{ '--lead-color': summary.color } as React.CSSProperties}
            onClick={() => onOpen(summary.label)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen(summary.label);
              }
            }}
          >
            <Stack spacing={0.9}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <Box minWidth={0}>
                  <Typography fontWeight={950} data-no-i18n>
                    {summary.label}
                  </Typography>
                  <Typography className="lead-mix-row-meta" variant="caption" color="text.secondary">
                    {summary.count.toLocaleString(languageLocale(language))}/{summary.total.toLocaleString(languageLocale(language))} toko - Avg M {summary.avgMerchant} / DQ{' '}
                    {summary.avgQuality}
                  </Typography>
                </Box>
                <Typography className="lead-mix-percent">{summary.rate}%</Typography>
              </Stack>
              <LinearProgress
                className="lead-mix-progress"
                variant="determinate"
                value={Math.min(100, summary.rate)}
                sx={{ '& .MuiLinearProgress-bar': { backgroundColor: summary.color } }}
              />
              <Stack className="lead-mix-row-extra" direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap minWidth={0}>
                  <Chip size="small" label={summary.topCityLabel} variant="outlined" />
                  <Chip size="small" label={`${summary.warningCount} warning`} color={summary.warningCount ? 'warning' : 'default'} variant="outlined" />
                </Stack>
                <Box className="lead-mix-action">
                  <Typography variant="caption" fontWeight={950}>
                    Detail
                  </Typography>
                  <KeyboardArrowRightRoundedIcon fontSize="small" />
                </Box>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

function niceChartMax(value: number) {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

function DashboardTimeSeriesPanel({
  points,
  loading,
  error,
  language,
  summary,
  selectedSurveyorId,
  surveyorOptions,
  mode,
  activeOptionalSeries,
  onSurveyorChange,
  onModeChange,
  onToggleSeries,
  onRefresh,
}: {
  points: DashboardTimeSeriesViewPoint[];
  loading: boolean;
  error: string;
  language: AppLanguage;
  summary?: DashboardTimeSeriesSummary;
  selectedSurveyorId: string;
  surveyorOptions: DashboardTimeSeriesSurveyorOption[];
  mode: DashboardTimeSeriesMode;
  activeOptionalSeries: Record<DashboardTimeSeriesOptionalKey, boolean>;
  onSurveyorChange: (surveyorId: string) => void;
  onModeChange: (mode: DashboardTimeSeriesMode) => void;
  onToggleSeries: (metric: DashboardTimeSeriesOptionalKey) => void;
  onRefresh: () => void;
}) {
  const visibleSeries = dashboardTimeSeriesKeys.filter((metric) => metric === 'submitted' || activeOptionalSeries[metric as DashboardTimeSeriesOptionalKey]);
  const maxVisibleValue = Math.max(1, ...points.flatMap((point) => visibleSeries.map((metric) => point[metric])));
  const submittedTotal = summary?.totals.submitted ?? dashboardTimeSeriesDisplayValue(points, 'submitted', mode);
  const verifiedTotal = summary?.totals.verified ?? dashboardTimeSeriesDisplayValue(points, 'verified', mode);
  const hotTotal = summary?.totals.hot ?? dashboardTimeSeriesDisplayValue(points, 'hot', mode);
  const warningTotal = summary?.totals.warnings ?? dashboardTimeSeriesDisplayValue(points, 'warnings', mode);
  const targetLimit = summary?.target ?? 0;
  const yMax = mode === 'target' ? niceChartMax(Math.max(maxVisibleValue, targetLimit, 1)) : niceChartMax(maxVisibleValue);
  const chartWidth = 980;
  const chartHeight = 322;
  const padding = { top: 26, right: 24, bottom: 48, left: 50 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const pointX = (index: number) => padding.left + (points.length <= 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const pointY = (value: number) => padding.top + plotHeight - (Math.min(value, yMax) / yMax) * plotHeight;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(yMax * ratio));
  const xTickEvery = Math.max(1, Math.ceil(points.length / 7));
  const rangeLabel = points.length ? `${points[0].dateLabel} - ${points[points.length - 1].dateLabel}` : '-';
  const valueModeLabel =
    mode === 'target'
      ? localCopy(language, { id: 'Kumulatif', en: 'Cumulative', zh: '累计' })
      : localCopy(language, { id: 'Harian', en: 'Daily', zh: '每日' });
  const scaleLabel =
    mode === 'target'
      ? `${summary?.progressPercent ?? 0}% ${localCopy(language, { id: 'dari target', en: 'of target', zh: '目标进度' })}`
      : `${localCopy(language, { id: 'Peak harian', en: 'Daily peak', zh: '日峰值' })} ${(summary?.peak.submitted ?? maxVisibleValue).toLocaleString(languageLocale(language))}`;
  const generatedAtLabel = summary?.generatedAt ? `${formatSurveyHistoryDate(summary.generatedAt, language)} ${formatSurveyHistoryTime(summary.generatedAt, language)}` : '-';
  const selectedSurveyorLabel =
    selectedSurveyorId === 'all'
      ? localCopy(language, { id: 'Semua surveyor', en: 'All surveyors', zh: '全部调研员' })
      : summary?.selectedSurveyorName || surveyorOptions.find((surveyor) => surveyor.id === selectedSurveyorId)?.name || selectedSurveyorId;
  const validRate = submittedTotal ? Math.round((verifiedTotal / submittedTotal) * 100) : 0;
  const warningRate = submittedTotal ? Math.round((warningTotal / submittedTotal) * 100) : 0;
  const targetProgressLabel =
    mode === 'target'
      ? `${submittedTotal.toLocaleString(languageLocale(language))}/${targetLimit.toLocaleString(languageLocale(language))}`
      : `${(summary?.peak.submitted ?? 0).toLocaleString(languageLocale(language))} submit`;

  const polylineFor = (metric: DashboardMetricKey) =>
    points.map((point, index) => `${pointX(index).toFixed(1)},${pointY(point[metric]).toFixed(1)}`).join(' ');

  return (
    <Paper className="section-panel time-series-panel">
      <SectionTitle
        icon={<AnalyticsRoundedIcon />}
        title="Survey Trend"
        action={
          <Stack direction="row" spacing={1} alignItems="center" className="time-series-header-actions">
            <TextField
              select
              size="small"
              label="Surveyor"
              value={selectedSurveyorId}
              onChange={(event) => onSurveyorChange(event.target.value)}
              className="time-series-surveyor-select"
            >
              <MenuItem value="all">{localCopy(language, { id: 'Semua surveyor', en: 'All surveyors', zh: '全部调研员' })}</MenuItem>
              {surveyorOptions.map((surveyor) => (
                <MenuItem key={surveyor.id} value={surveyor.id}>
                  {surveyor.name} ({surveyor.submitted.toLocaleString(languageLocale(language))})
                </MenuItem>
              ))}
            </TextField>
            <IconButton size="small" className="time-series-refresh-button" onClick={onRefresh} aria-label="Refresh survey trend" disabled={loading}>
              <RestartAltRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        }
      />

      <Stack spacing={1.35} className="time-series-content">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} gap={1.2}>
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap className="time-series-toggle-row">
            <RadioGroup
              row
              value={mode}
              onChange={(event) => onModeChange(event.target.value as DashboardTimeSeriesMode)}
              className="time-series-mode-group"
              aria-label="Survey trend mode"
            >
              <FormControlLabel value="runRate" control={<Radio size="small" />} label="Run rate" />
              <FormControlLabel value="target" control={<Radio size="small" />} label="Target 30 hari" />
            </RadioGroup>
            <Chip
              size="small"
              label={dashboardMetricTitle('submitted', language)}
              className="time-series-locked-chip"
              sx={{ '--series-color': dashboardMetricTone('submitted') } as React.CSSProperties}
            />
            {dashboardTimeSeriesOptionalKeys.map((metric) => (
              <FormControlLabel
                key={metric}
                className="time-series-check"
                sx={{ '--series-color': dashboardMetricTone(metric) } as React.CSSProperties}
                control={<Checkbox size="small" checked={activeOptionalSeries[metric]} onChange={() => onToggleSeries(metric)} />}
                label={dashboardMetricTitle(metric, language)}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'flex-start', md: 'flex-end' }} className="time-series-meta-row">
            <Chip size="small" label={selectedSurveyorLabel} variant="outlined" />
            <Chip size="small" label={rangeLabel} variant="outlined" />
            <Chip size="small" label={scaleLabel} variant="outlined" />
            <Chip size="small" label={`${localCopy(language, { id: 'Update', en: 'Updated', zh: '更新' })} ${generatedAtLabel}`} variant="outlined" />
          </Stack>
        </Stack>

        <Box className="time-series-insight-grid">
          <Box className="time-series-insight" sx={{ '--series-color': dashboardMetricTone('submitted') } as React.CSSProperties}>
            <Typography variant="caption" color="text.secondary">
              {mode === 'target' ? 'Submitted cumulative' : 'Submitted visits'}
            </Typography>
            <Typography className="time-series-insight-value">{submittedTotal.toLocaleString(languageLocale(language))}</Typography>
            <Typography variant="caption" color="text.secondary">
              {mode === 'target' ? `${valueModeLabel} ${summary?.targetDays ?? 30} hari` : `${valueModeLabel} dari range aktif`}
            </Typography>
          </Box>
          <Box className="time-series-insight" sx={{ '--series-color': '#9ee6ff' } as React.CSSProperties}>
            <Typography variant="caption" color="text.secondary">
              {mode === 'target' ? 'Target progress' : 'Peak submit day'}
            </Typography>
            <Typography className="time-series-insight-value">{mode === 'target' ? `${summary?.progressPercent ?? 0}%` : targetProgressLabel}</Typography>
            <Typography variant="caption" color="text.secondary">
              {mode === 'target' ? targetProgressLabel : rangeLabel}
            </Typography>
          </Box>
          <Box className="time-series-insight" sx={{ '--series-color': dashboardMetricTone('verified') } as React.CSSProperties}>
            <Typography variant="caption" color="text.secondary">
              Verified valid
            </Typography>
            <Typography className="time-series-insight-value">{`${validRate}%`}</Typography>
            <Typography variant="caption" color="text.secondary">
              {verifiedTotal.toLocaleString(languageLocale(language))} valid
            </Typography>
          </Box>
          <Box className="time-series-insight" sx={{ '--series-color': dashboardMetricTone('warnings') } as React.CSSProperties}>
            <Typography variant="caption" color="text.secondary">
              Warning load
            </Typography>
            <Typography className="time-series-insight-value">{`${warningRate}%`}</Typography>
            <Typography variant="caption" color="text.secondary">
              {warningTotal.toLocaleString(languageLocale(language))} perlu review, {hotTotal.toLocaleString(languageLocale(language))} hot
            </Typography>
          </Box>
        </Box>

        {loading && <LinearProgress />}

        {!loading && error && (
          <Alert
            severity="warning"
            action={
              <Button size="small" onClick={onRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && !points.length ? (
          <Box className="history-empty-card">
            <Typography fontWeight={900}>Belum ada data time series.</Typography>
            <Typography variant="body2" color="text.secondary">
              Chart akan muncul setelah survey pertama disubmit.
            </Typography>
          </Box>
        ) : null}

        {!error && points.length > 0 && (
          <>
            <Box className="time-series-chart" role="img" aria-label={`Daily survey trend for ${selectedSurveyorLabel}`}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="time-series-submitted-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={dashboardMetricTone('submitted')} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={dashboardMetricTone('submitted')} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect className="time-series-plot-bg" x={padding.left} y={padding.top} width={plotWidth} height={plotHeight} rx="10" />
                {yTicks.map((tick) => (
                  <g key={tick}>
                    <line className="time-series-grid-line" x1={padding.left} x2={chartWidth - padding.right} y1={pointY(tick)} y2={pointY(tick)} />
                    <text className="time-series-y-label" x={padding.left - 12} y={pointY(tick)} textAnchor="end" dominantBaseline="middle">
                      {tick.toLocaleString(languageLocale(language))}
                    </text>
                  </g>
                ))}
                {mode === 'target' && targetLimit > 0 && (
                  <g>
                    <line
                      className="time-series-target-reference"
                      x1={padding.left}
                      x2={chartWidth - padding.right}
                      y1={pointY(targetLimit)}
                      y2={pointY(targetLimit)}
                    />
                    <text className="time-series-target-label" x={chartWidth - padding.right - 8} y={Math.max(16, pointY(targetLimit) - 8)} textAnchor="end">
                      Target {targetLimit.toLocaleString(languageLocale(language))}
                    </text>
                  </g>
                )}
                {points.map((point, index) => {
                  if (index % xTickEvery !== 0 && index !== points.length - 1) return null;
                  return (
                    <g key={point.dateKey}>
                      <line className="time-series-x-tick" x1={pointX(index)} x2={pointX(index)} y1={padding.top} y2={padding.top + plotHeight} />
                      <text className="time-series-x-label" x={pointX(index)} y={chartHeight - 17} textAnchor="middle">
                        {point.shortLabel}
                      </text>
                    </g>
                  );
                })}
                {points.length > 1 && (
                  <polygon
                    className="time-series-area"
                    points={`${padding.left},${padding.top + plotHeight} ${polylineFor('submitted')} ${padding.left + plotWidth},${padding.top + plotHeight}`}
                  />
                )}
                {visibleSeries.map((metric) => (
                  <g key={metric}>
                    <polyline className="time-series-line" points={polylineFor(metric)} stroke={dashboardMetricTone(metric)} />
                    {points.map((point, index) => (
                      <circle
                        key={`${metric}-${point.dateKey}`}
                        className="time-series-point"
                        cx={pointX(index)}
                        cy={pointY(point[metric])}
                        r={metric === 'submitted' ? 4.2 : 3.6}
                        fill={dashboardMetricTone(metric)}
                      >
                        <title>
                          {point.dateLabel} - {dashboardMetricTitle(metric, language)} ({valueModeLabel}): {point[metric].toLocaleString(languageLocale(language))}
                        </title>
                      </circle>
                    ))}
                  </g>
                ))}
              </svg>
            </Box>

          </>
        )}
      </Stack>
    </Paper>
  );
}

function signalItemReason(label: string, value: string, language: AppLanguage) {
  if (/supplier dissatisfaction/i.test(label)) {
    return localCopy(language, {
      id: `${value} berasal dari rasio toko yang menjawab kurang puas terhadap supplier saat ini, memiliki keluhan supplier, atau memberi sinyal ingin mencari alternatif supplier. Sistem membaginya dengan total survey relevan pada scope aktif.`,
      en: `${value} comes from the share of stores that report dissatisfaction with their current supplier, supplier pain points, or intent to find an alternative supplier. The system divides those records by the relevant survey total in the active scope.`,
      zh: `${value} 来自对当前供应商不满意、有供应商痛点或表达寻找替代供应商意向的门店占比。系统用这些记录数除以当前范围内的相关调研总数。`,
    });
  }
  if (/low cost import acceptance/i.test(label)) {
    return localCopy(language, {
      id: `${value} dihitung dari toko yang menunjukkan penerimaan terhadap produk import low cost, misalnya memilih opsi terbuka mencoba produk sejenis, sensitif terhadap harga, atau menjadikan margin/harga rendah sebagai driver pembelian.`,
      en: `${value} is calculated from stores that show acceptance of low-cost import products, such as being open to trying similar products, price-sensitive, or selecting margin/low price as a purchase driver.`,
      zh: `${value} 根据接受低价进口产品的门店计算，例如愿意尝试同类产品、价格敏感，或将利润/低价列为采购驱动因素的门店。`,
    });
  }
  if (/owner reachable/i.test(label)) {
    return localCopy(language, {
      id: `${value} adalah persentase survey dengan nomor customer yang sudah ditandai verifikator bisa ditelepon atau reachable via WhatsApp. Status WA reachable tetap menjadi syarat Hot Lead.`,
      en: `${value} is the percentage of surveys whose customer number is marked by the verifier as callable or reachable via WhatsApp. WhatsApp reachability remains required for Hot Lead eligibility.`,
      zh: `${value} 是审核员标记客户号码可电话联系或可通过 WhatsApp 联系的调研占比。WhatsApp 可达性仍是高意向线索的条件。`,
    });
  }
  if (/photo evidence complete/i.test(label)) {
    return localCopy(language, {
      id: `${value} dihitung dari survey yang memiliki evidence foto wajib secara lengkap. Jika foto rak atau foto PIC kosong, sistem menurunkan Data Quality dan record masuk perhatian verifikator.`,
      en: `${value} is calculated from surveys that include all required photo evidence. Missing rack or PIC photos reduce Data Quality and move the record into verifier attention.`,
      zh: `${value} 根据必需照片证据完整的调研记录计算。缺少货架照或 PIC 照会降低数据质量，并进入审核关注队列。`,
    });
  }
  if (/latitude/i.test(label)) {
    return localCopy(language, {
      id: `${value} adalah latitude yang ditangkap dari geolocation perangkat saat surveyor menekan Capture GPS atau submit survey. Nilai ini dipakai bersama longitude untuk validasi lokasi toko.`,
      en: `${value} is the latitude captured from device geolocation when the surveyor taps Capture GPS or submits the survey. It is paired with longitude to validate the store location.`,
      zh: `${value} 是调研员点击 Capture GPS 或提交调研时由设备定位获取的纬度。它会与经度一起用于验证门店位置。`,
    });
  }
  if (/longitude/i.test(label)) {
    return localCopy(language, {
      id: `${value} adalah longitude yang ditangkap dari geolocation perangkat saat surveyor menekan Capture GPS atau submit survey. Nilai ini dipakai untuk menghitung jarak dari titik target toko.`,
      en: `${value} is the longitude captured from device geolocation when the surveyor taps Capture GPS or submits the survey. It is used to calculate distance from the store target point.`,
      zh: `${value} 是调研员点击 Capture GPS 或提交调研时由设备定位获取的经度。系统用它计算与目标门店点位的距离。`,
    });
  }
  if (/accuracy/i.test(label)) {
    return localCopy(language, {
      id: `${value} menunjukkan akurasi geolocation perangkat dalam meter. Semakin kecil nilainya semakin presisi; akurasi yang lemah membuat verifikator perlu membandingkan alamat, koordinat, dan evidence foto.`,
      en: `${value} shows the device geolocation accuracy in meters. Lower is more precise; weak accuracy means the verifier should compare address, coordinates, and photo evidence.`,
      zh: `${value} 表示设备定位精度，单位为米。数值越小越精确；精度较弱时，审核员需要对比地址、坐标和照片证据。`,
    });
  }
  if (/distance/i.test(label)) {
    return localCopy(language, {
      id: `${value} dihitung dari selisih koordinat submit dengan koordinat target toko. Jika lebih dari 100 meter, sistem memberi GPS warning karena lokasi survey perlu dicek ulang.`,
      en: `${value} is calculated from the submitted coordinates versus the target store coordinates. If it is over 100 meters, the system assigns a GPS warning because the survey location needs review.`,
      zh: `${value} 根据提交坐标与目标门店坐标的距离计算。超过 100 米时，系统会给出 GPS 预警，因为调研位置需要复核。`,
    });
  }
  return localCopy(language, {
    id: `${value} dihitung dari field operasional pada backend untuk baris ini. Sistem menerapkan aturan validasi dan agregasi sesuai jenis metrik, lalu menampilkan hasil akhirnya sebagai chip ringkas.`,
    en: `${value} is calculated from backend operational fields for this row. The system applies validation and aggregation rules for the metric type, then shows the final result as a compact chip.`,
    zh: `${value} 根据该行的后端运营字段计算。系统按照指标类型应用校验和汇总规则，并将最终结果显示为简洁标签。`,
  });
}

function SupplierSignalCard({
  signal,
  language,
  onOpen,
}: {
  signal: SupplierSignalSummary;
  language: AppLanguage;
  onOpen: () => void;
}) {
  const valueLabel = `${signal.rate}%`;
  return (
    <Box
      className="supplier-signal-card"
      role="button"
      tabIndex={0}
      sx={{ '--signal-color': signal.color } as React.CSSProperties}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box minWidth={0}>
            <Typography fontWeight={950}>{signal.label}</Typography>
            <Typography className="supplier-signal-caption" variant="caption" color="text.secondary">
              {signal.caption}
            </Typography>
          </Box>
          <Chip size="small" label={valueLabel} color={signal.tone} reason={signalItemReason(signal.label, valueLabel, language)} />
        </Stack>
        <LinearProgress
          className="supplier-signal-progress"
          variant="determinate"
          value={Math.min(100, signal.rate)}
          sx={{ '& .MuiLinearProgress-bar': { backgroundColor: signal.color } }}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap minWidth={0}>
            <Chip size="small" label={`${signal.count}/${signal.total} toko`} variant="outlined" />
            <Chip size="small" label={`7d ${signal.recentRate}%`} variant="outlined" />
            <Chip size="small" label={signal.topCityLabel} variant="outlined" />
          </Stack>
          <Box className="supplier-signal-action">
            <Typography variant="caption" fontWeight={950}>
              Detail
            </Typography>
            <KeyboardArrowRightRoundedIcon fontSize="small" />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

function SignalItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'primary' | 'warning' | 'info' | 'success';
}) {
  const language = useCurrentLanguage();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" className="signal-item">
      <Typography>{label}</Typography>
      <Chip size="small" label={value} color={tone} reason={signalItemReason(label, value, language)} />
    </Stack>
  );
}

function ScoreBadge({
  label,
  value,
  caption,
  tone,
  detail,
  onOpen,
}: {
  label: string;
  value: string;
  caption: string;
  tone: string;
  detail?: string;
  onOpen?: () => void;
}) {
  return (
    <Paper
      className={`score-badge${detail ? ' has-detail' : ''}${onOpen ? ' clickable' : ''}`}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={`${label}. ${value}. ${caption}${detail ? `. ${detail}` : ''}`}
      sx={{ '--score-tone': tone } as React.CSSProperties}
      onClick={onOpen}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onOpen) {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="body2" color="text.secondary">
        {caption}
      </Typography>
      {detail && (
        <Typography className="score-badge-detail" variant="caption">
          {detail}
        </Typography>
      )}
    </Paper>
  );
}

export default App;
