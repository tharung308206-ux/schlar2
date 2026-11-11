import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Vehicle,
  TransportRoute,
  TransportStop,
  StudentTransportAssignment,
  VehicleMaintenance,
  TransportIncident,
  TransportAnnouncement,
  Student
} from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import {
  LayoutDashboard,
  Bus,
  Users,
  Briefcase,
  Clock,
  MapPin,
  GraduationCap,
  FileSpreadsheet,
  Wrench,
  ShieldAlert,
  Bell,
  BarChart3,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Phone,
  Printer,
  Download,
  AlertCircle,
  FileText,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// Initial Registered Vehicles Fleet
const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    registrationNumber: 'DL-01-EA-4921',
    makeModel: 'Tata Starbus Ultra 40-Seater',
    type: 'Bus',
    capacity: 40,
    assignedRouteId: 'route-1',
    assignedRouteName: 'R-01: North Campus & Palm Meadows',
    driverId: 'drv-01',
    driverName: 'Harish Rawat',
    driverPhone: '+1 (555) 401-9201',
    conductorName: 'Sunil Paswan',
    status: 'Active',
    insuranceExpiry: '2027-04-15',
    fitnessExpiry: '2027-06-30',
    fuelType: 'CNG',
    lastServiceDate: '2026-09-10',
    gpsUnitId: 'GPS-TRK-4921'
  },
  {
    id: 'veh-02',
    registrationNumber: 'DL-01-EA-5104',
    makeModel: 'Ashok Leyland Oyster 45-Seater',
    type: 'Bus',
    capacity: 45,
    assignedRouteId: 'route-2',
    assignedRouteName: 'R-02: Metro City & South Extension',
    driverId: 'drv-02',
    driverName: 'Ranjit Singh',
    driverPhone: '+1 (555) 892-1402',
    conductorName: 'Mukesh Sharma',
    status: 'Active',
    insuranceExpiry: '2027-03-20',
    fitnessExpiry: '2027-05-18',
    fuelType: 'Diesel',
    lastServiceDate: '2026-08-25',
    gpsUnitId: 'GPS-TRK-5104'
  },
  {
    id: 'veh-03',
    registrationNumber: 'DL-01-EA-6320',
    makeModel: 'Eicher Skyline Pro 35-Seater',
    type: 'Bus',
    capacity: 35,
    assignedRouteId: 'route-3',
    assignedRouteName: 'R-03: West End Hills & Cyber Enclave',
    driverId: 'drv-03',
    driverName: 'Baldev Prasad',
    driverPhone: '+1 (555) 239-0803',
    conductorName: 'Dinesh Yadav',
    status: 'Active',
    insuranceExpiry: '2027-08-10',
    fitnessExpiry: '2027-09-12',
    fuelType: 'CNG',
    lastServiceDate: '2026-09-18',
    gpsUnitId: 'GPS-TRK-6320'
  },
  {
    id: 'veh-04',
    registrationNumber: 'DL-01-EA-7811',
    makeModel: 'Tata Starbus Ultra 40-Seater',
    type: 'Bus',
    capacity: 40,
    assignedRouteId: 'route-4',
    assignedRouteName: 'R-04: East Lake View & Residency',
    driverId: 'drv-04',
    driverName: 'Mohinder Paul',
    driverPhone: '+1 (555) 762-0304',
    conductorName: 'Naresh Kumar',
    status: 'Active',
    insuranceExpiry: '2027-01-25',
    fitnessExpiry: '2027-03-15',
    fuelType: 'CNG',
    lastServiceDate: '2026-09-02',
    gpsUnitId: 'GPS-TRK-7811'
  },
  {
    id: 'veh-05',
    registrationNumber: 'DL-01-EA-9022',
    makeModel: 'Force Traveller Mini-Bus 20-Seater',
    type: 'Mini-Bus',
    capacity: 20,
    assignedRouteId: undefined,
    assignedRouteName: undefined,
    driverId: undefined,
    driverName: undefined,
    driverPhone: undefined,
    conductorName: undefined,
    status: 'Under Maintenance',
    insuranceExpiry: '2026-11-30',
    fitnessExpiry: '2026-12-15',
    fuelType: 'Diesel',
    lastServiceDate: '2026-10-14',
    gpsUnitId: 'GPS-TRK-9022'
  }
];

// Initial Drivers List
const INITIAL_DRIVERS = [
  {
    id: 'drv-01',
    name: 'Harish Rawat',
    staffId: 'OPS-DRV-101',
    phone: '+1 (555) 401-9201',
    licenseNumber: 'DL-HEV-2014-98124',
    licenseExpiry: '2028-05-14',
    assignedVehicle: 'DL-01-EA-4921 (Bus 1)',
    assignedRoute: 'R-01: North Campus & Palm Meadows',
    experienceYears: 12,
    medicalStatus: 'Certified Fit (Annual Review 2026-08)',
    shift: '06:15 AM - 03:45 PM'
  },
  {
    id: 'drv-02',
    name: 'Ranjit Singh',
    staffId: 'OPS-DRV-102',
    phone: '+1 (555) 892-1402',
    licenseNumber: 'DL-HEV-2016-77401',
    licenseExpiry: '2029-02-20',
    assignedVehicle: 'DL-01-EA-5104 (Bus 2)',
    assignedRoute: 'R-02: Metro City & South Extension',
    experienceYears: 15,
    medicalStatus: 'Certified Fit (Annual Review 2026-07)',
    shift: '06:00 AM - 03:30 PM'
  },
  {
    id: 'drv-03',
    name: 'Baldev Prasad',
    staffId: 'OPS-DRV-103',
    phone: '+1 (555) 239-0803',
    licenseNumber: 'DL-HEV-2018-63912',
    licenseExpiry: '2028-11-05',
    assignedVehicle: 'DL-01-EA-6320 (Bus 3)',
    assignedRoute: 'R-03: West End Hills & Cyber Enclave',
    experienceYears: 9,
    medicalStatus: 'Certified Fit (Annual Review 2026-09)',
    shift: '06:20 AM - 03:50 PM'
  },
  {
    id: 'drv-04',
    name: 'Mohinder Paul',
    staffId: 'OPS-DRV-104',
    phone: '+1 (555) 762-0304',
    licenseNumber: 'DL-HEV-2015-81203',
    licenseExpiry: '2027-10-18',
    assignedVehicle: 'DL-01-EA-7811 (Bus 4)',
    assignedRoute: 'R-04: East Lake View & Residency',
    experienceYears: 14,
    medicalStatus: 'Certified Fit (Annual Review 2026-06)',
    shift: '06:30 AM - 04:00 PM'
  }
];

// Initial Support Attendants & Conductors
const INITIAL_ATTENDANTS = [
  { id: 'att-01', name: 'Sunil Paswan', staffId: 'OPS-ATT-201', phone: '+1 (555) 401-9288', route: 'R-01', firstAidCert: 'Valid (Red Cross Level 1)', duty: 'Student Attendance & Escort Safety' },
  { id: 'att-02', name: 'Mukesh Sharma', staffId: 'OPS-ATT-202', phone: '+1 (555) 892-1499', route: 'R-02', firstAidCert: 'Valid (Red Cross Level 1)', duty: 'Student Attendance & Escort Safety' },
  { id: 'att-03', name: 'Dinesh Yadav', staffId: 'OPS-ATT-203', phone: '+1 (555) 239-0877', route: 'R-03', firstAidCert: 'Valid (Red Cross Level 1)', duty: 'Student Attendance & Escort Safety' },
  { id: 'att-04', name: 'Naresh Kumar', staffId: 'OPS-ATT-204', phone: '+1 (555) 762-0355', route: 'R-04', firstAidCert: 'Valid (Red Cross Level 1)', duty: 'Student Attendance & Escort Safety' }
];

// Initial Routes with Ordered Stops
const INITIAL_ROUTES: TransportRoute[] = [
  {
    id: 'route-1',
    routeNumber: 'R-01',
    name: 'North Campus & Palm Meadows',
    startPoint: 'Palm Meadows Gate 1',
    endPoint: 'Greenfield Main Campus Gate',
    busId: 'veh-01',
    busNumber: 'DL-01-EA-4921',
    driverId: 'drv-01',
    driverName: 'Harish Rawat',
    driverPhone: '+1 (555) 401-9201',
    conductorName: 'Sunil Paswan',
    capacity: 40,
    assignedCount: 36,
    morningStart: '06:45 AM',
    afternoonStart: '02:30 PM',
    operatingDays: 'Monday - Friday',
    status: 'Active',
    stops: [
      { id: 'stp-101', routeId: 'route-1', stopName: 'Palm Meadows Gate 1', landmark: 'Opposite Clubhouse', morningPickupTime: '06:45 AM', afternoonDropTime: '03:15 PM', sequence: 1, studentsCount: 12 },
      { id: 'stp-102', routeId: 'route-1', stopName: 'Silver Spring Junction', landmark: 'Near Heritage Clinic', morningPickupTime: '07:00 AM', afternoonDropTime: '03:00 PM', sequence: 2, studentsCount: 10 },
      { id: 'stp-103', routeId: 'route-1', stopName: 'Maple Leaf Avenue', landmark: 'Sector 5 Traffic Post', morningPickupTime: '07:15 AM', afternoonDropTime: '02:45 PM', sequence: 3, studentsCount: 14 },
      { id: 'stp-104', routeId: 'route-1', stopName: 'Greenfield Main Campus Gate', landmark: 'Campus Terminus (Gate 3)', morningPickupTime: '07:35 AM', afternoonDropTime: '02:30 PM', sequence: 4, studentsCount: 0 }
    ]
  },
  {
    id: 'route-2',
    routeNumber: 'R-02',
    name: 'Metro City & South Extension',
    startPoint: 'Central Park Towers',
    endPoint: 'Greenfield Main Campus Gate',
    busId: 'veh-02',
    busNumber: 'DL-01-EA-5104',
    driverId: 'drv-02',
    driverName: 'Ranjit Singh',
    driverPhone: '+1 (555) 892-1402',
    conductorName: 'Mukesh Sharma',
    capacity: 45,
    assignedCount: 42,
    morningStart: '06:30 AM',
    afternoonStart: '02:30 PM',
    operatingDays: 'Monday - Friday',
    status: 'Active',
    stops: [
      { id: 'stp-201', routeId: 'route-2', stopName: 'Central Park Towers', landmark: 'Tower 4 Gate', morningPickupTime: '06:30 AM', afternoonDropTime: '03:30 PM', sequence: 1, studentsCount: 16 },
      { id: 'stp-202', routeId: 'route-2', stopName: 'South Ext Flyover', landmark: 'Metro Pillar 142', morningPickupTime: '06:50 AM', afternoonDropTime: '03:10 PM', sequence: 2, studentsCount: 14 },
      { id: 'stp-203', routeId: 'route-2', stopName: 'Lotus Boulevard', landmark: 'Block B Crossing', morningPickupTime: '07:10 AM', afternoonDropTime: '02:50 PM', sequence: 3, studentsCount: 12 },
      { id: 'stp-204', routeId: 'route-2', stopName: 'Greenfield Main Campus Gate', landmark: 'Campus Terminus (Gate 3)', morningPickupTime: '07:35 AM', afternoonDropTime: '02:30 PM', sequence: 4, studentsCount: 0 }
    ]
  },
  {
    id: 'route-3',
    routeNumber: 'R-03',
    name: 'West End Hills & Cyber Enclave',
    startPoint: 'Highland Residency',
    endPoint: 'Greenfield Main Campus Gate',
    busId: 'veh-03',
    busNumber: 'DL-01-EA-6320',
    driverId: 'drv-03',
    driverName: 'Baldev Prasad',
    driverPhone: '+1 (555) 239-0803',
    conductorName: 'Dinesh Yadav',
    capacity: 35,
    assignedCount: 31,
    morningStart: '06:50 AM',
    afternoonStart: '02:30 PM',
    operatingDays: 'Monday - Friday',
    status: 'Active',
    stops: [
      { id: 'stp-301', routeId: 'route-3', stopName: 'Highland Residency', landmark: 'Main Guard Post', morningPickupTime: '06:50 AM', afternoonDropTime: '03:10 PM', sequence: 1, studentsCount: 11 },
      { id: 'stp-302', routeId: 'route-3', stopName: 'Cyber Hub Circle', landmark: 'Tech Zone Rotary', morningPickupTime: '07:05 AM', afternoonDropTime: '02:55 PM', sequence: 2, studentsCount: 9 },
      { id: 'stp-303', routeId: 'route-3', stopName: 'Grand View Crossing', landmark: 'Hill Road Junction', morningPickupTime: '07:20 AM', afternoonDropTime: '02:40 PM', sequence: 3, studentsCount: 11 },
      { id: 'stp-304', routeId: 'route-3', stopName: 'Greenfield Main Campus Gate', landmark: 'Campus Terminus (Gate 3)', morningPickupTime: '07:35 AM', afternoonDropTime: '02:30 PM', sequence: 4, studentsCount: 0 }
    ]
  },
  {
    id: 'route-4',
    routeNumber: 'R-04',
    name: 'East Lake View & Residency',
    startPoint: 'Lakeview Apartments',
    endPoint: 'Greenfield Main Campus Gate',
    busId: 'veh-04',
    busNumber: 'DL-01-EA-7811',
    driverId: 'drv-04',
    driverName: 'Mohinder Paul',
    driverPhone: '+1 (555) 762-0304',
    conductorName: 'Naresh Kumar',
    capacity: 40,
    assignedCount: 34,
    morningStart: '07:00 AM',
    afternoonStart: '02:30 PM',
    operatingDays: 'Monday - Friday',
    status: 'Active',
    stops: [
      { id: 'stp-401', routeId: 'route-4', stopName: 'Lakeview Apartments', landmark: 'Lake Gate 2', morningPickupTime: '07:00 AM', afternoonDropTime: '03:00 PM', sequence: 1, studentsCount: 12 },
      { id: 'stp-402', routeId: 'route-4', stopName: 'City Club Gate', landmark: 'Clubhouse Entrance', morningPickupTime: '07:12 AM', afternoonDropTime: '02:48 PM', sequence: 2, studentsCount: 10 },
      { id: 'stp-403', routeId: 'route-4', stopName: 'Riverdale Crossing', landmark: 'Bridge Roundabout', morningPickupTime: '07:22 AM', afternoonDropTime: '02:38 PM', sequence: 3, studentsCount: 12 },
      { id: 'stp-404', routeId: 'route-4', stopName: 'Greenfield Main Campus Gate', landmark: 'Campus Terminus (Gate 3)', morningPickupTime: '07:35 AM', afternoonDropTime: '02:30 PM', sequence: 4, studentsCount: 0 }
    ]
  }
];

// Initial Student Transport Assignments
const INITIAL_STUDENT_ASSIGNMENTS: StudentTransportAssignment[] = [
  {
    id: 'sta-1',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    classId: 'class-8a',
    className: 'Grade 8A',
    routeId: 'route-1',
    routeNumber: 'R-01',
    pickupStopId: 'stp-101',
    pickupStopName: 'Palm Meadows Gate 1',
    dropoffStopId: 'stp-101',
    dropoffStopName: 'Palm Meadows Gate 1',
    guardianContact: '+1 (555) 349-2180 (Ramesh Sharma)',
    seatNumber: 14,
    status: 'Active',
    effectiveDate: '2026-06-01'
  },
  {
    id: 'sta-2',
    studentId: 'std-5b-01',
    studentName: 'Ananya Sharma',
    classId: 'class-5b',
    className: 'Grade 5B',
    routeId: 'route-1',
    routeNumber: 'R-01',
    pickupStopId: 'stp-101',
    pickupStopName: 'Palm Meadows Gate 1',
    dropoffStopId: 'stp-101',
    dropoffStopName: 'Palm Meadows Gate 1',
    guardianContact: '+1 (555) 349-2180 (Ramesh Sharma)',
    seatNumber: 15,
    status: 'Active',
    effectiveDate: '2026-06-01'
  },
  {
    id: 'sta-3',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    classId: 'class-10a',
    className: 'Grade 10A',
    routeId: 'route-2',
    routeNumber: 'R-02',
    pickupStopId: 'stp-201',
    pickupStopName: 'Central Park Towers',
    dropoffStopId: 'stp-201',
    dropoffStopName: 'Central Park Towers',
    guardianContact: '+1 (555) 981-2201 (Sunil Mehta)',
    seatNumber: 8,
    status: 'Active',
    effectiveDate: '2026-06-01'
  },
  {
    id: 'sta-4',
    studentId: 'std-10a-02',
    studentName: 'Diya Kapoor',
    classId: 'class-10a',
    className: 'Grade 10A',
    routeId: 'route-3',
    routeNumber: 'R-03',
    pickupStopId: 'stp-301',
    pickupStopName: 'Highland Residency',
    dropoffStopId: 'stp-301',
    dropoffStopName: 'Highland Residency',
    guardianContact: '+1 (555) 778-9012 (Neha Kapoor)',
    seatNumber: 11,
    status: 'Active',
    effectiveDate: '2026-06-01'
  },
  {
    id: 'sta-5',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    classId: 'class-10a',
    className: 'Grade 10A',
    routeId: 'route-2',
    routeNumber: 'R-02',
    pickupStopId: 'stp-202',
    pickupStopName: 'South Ext Flyover',
    dropoffStopId: 'stp-202',
    dropoffStopName: 'South Ext Flyover',
    guardianContact: '+1 (555) 441-2098 (Rajesh Verma)',
    seatNumber: 19,
    status: 'Active',
    effectiveDate: '2026-06-01'
  },
  {
    id: 'sta-6',
    studentId: 'std-10a-04',
    studentName: 'Sara Khan',
    classId: 'class-10a',
    className: 'Grade 10A',
    routeId: 'route-4',
    routeNumber: 'R-04',
    pickupStopId: 'stp-401',
    pickupStopName: 'Lakeview Apartments',
    dropoffStopId: 'stp-401',
    dropoffStopName: 'Lakeview Apartments',
    guardianContact: '+1 (555) 890-1234 (Tariq Khan)',
    seatNumber: 5,
    status: 'Active',
    effectiveDate: '2026-06-01'
  }
];

// Initial Vehicle Maintenance
const INITIAL_MAINTENANCE: VehicleMaintenance[] = [
  {
    id: 'maint-1',
    vehicleId: 'veh-01',
    registrationNumber: 'DL-01-EA-4921',
    serviceType: 'Quarterly Brake & Suspension Inspection',
    serviceDate: '2026-09-10',
    nextDueDate: '2026-12-10',
    cost: 340.0,
    serviceCenter: 'Authorized Tata Fleet Workshop',
    status: 'Completed',
    notes: 'Brake pads replaced, air brake line pressure tested to RTO compliance.'
  },
  {
    id: 'maint-2',
    vehicleId: 'veh-05',
    registrationNumber: 'DL-01-EA-9022',
    serviceType: 'Engine Overhaul & Transmission Replacement',
    serviceDate: '2026-10-14',
    nextDueDate: '2026-10-28',
    cost: 820.0,
    serviceCenter: 'Force Motors Commercial Depot',
    status: 'In Progress',
    notes: 'Gearbox clutch assembly under overhaul. Vehicle unavailable for school dispatch.'
  },
  {
    id: 'maint-3',
    vehicleId: 'veh-02',
    registrationNumber: 'DL-01-EA-5104',
    serviceType: 'Annual RTO Fitness & Speed Governor Re-Calibration',
    serviceDate: '2026-08-25',
    nextDueDate: '2027-02-25',
    cost: 480.0,
    serviceCenter: 'State Transport Testing Grounds',
    status: 'Completed',
    notes: 'Electronic speed limiter sealed at 40 km/h as per school bus norms.'
  }
];

// Initial Transport Incidents
const INITIAL_INCIDENTS: TransportIncident[] = [
  {
    id: 'inc-1',
    incidentNumber: 'TR-INC-2026-041',
    date: '2026-10-15',
    time: '07:10 AM',
    routeId: 'route-2',
    routeNumber: 'R-02',
    vehicleRegistration: 'DL-01-EA-5104',
    driverName: 'Ranjit Singh',
    category: 'Traffic Delay',
    severity: 'Low',
    description: 'Flyover maintenance construction on Outer Ring Road caused 18-minute delay in morning arrival.',
    actionTaken: 'Parent delay advisory sent via portal; morning assembly exempt for onboard students.',
    status: 'Resolved'
  },
  {
    id: 'inc-2',
    incidentNumber: 'TR-INC-2026-042',
    date: '2026-10-18',
    time: '02:45 PM',
    routeId: 'route-3',
    routeNumber: 'R-03',
    vehicleRegistration: 'DL-01-EA-6320',
    driverName: 'Baldev Prasad',
    category: 'Minor Scrape',
    severity: 'Low',
    description: 'Stationary branch scraped side mirror casing during reverse turnaround at Cyber Hub cul-de-sac. No student injury.',
    actionTaken: 'Depot mechanic replaced mirror assembly; driver verified safe operating protocols.',
    status: 'Resolved'
  }
];

// Initial Transport Announcements
const INITIAL_ANNOUNCEMENTS: TransportAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Winter Morning Schedule Timing Adjustment',
    message: 'Effective November 1, all morning bus pickup timings will be shifted by 15 minutes later due to morning winter fog conditions.',
    targetRoute: 'All Routes',
    publishDate: '2026-10-20',
    status: 'Published',
    author: 'Gurpreet Singh (Transport Office)',
    priority: 'Normal'
  },
  {
    id: 'ann-2',
    title: 'Route 2 Detour Advisory for Oct 24',
    message: 'Due to municipal water pipeline excavation near Sector 8, Route 2 will bypass Metro Pillar 140 stop and board at South Extension Gate 2.',
    targetRoute: 'route-2',
    publishDate: '2026-10-21',
    status: 'Published',
    author: 'Gurpreet Singh (Transport Office)',
    priority: 'Urgent'
  }
];

export const TransportView: React.FC = () => {
  const { students, userProfiles, logAuditEvent, addToast, currentPage, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  // Operational State
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [attendants, setAttendants] = useState(INITIAL_ATTENDANTS);
  const [studentAssignments, setStudentAssignments] = useState<StudentTransportAssignment[]>(INITIAL_STUDENT_ASSIGNMENTS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenance[]>(INITIAL_MAINTENANCE);
  const [incidents, setIncidents] = useState<TransportIncident[]>(INITIAL_INCIDENTS);
  const [announcements, setAnnouncements] = useState<TransportAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Filters
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('all');
  const [routeSearch, setRouteSearch] = useState('');
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [assignmentRouteFilter, setAssignmentRouteFilter] = useState('all');
  const [selectedRosterRouteId, setSelectedRosterRouteId] = useState<string>('route-1');

  // Modals
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [showAssignStudentModal, setShowAssignStudentModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);

  // Form States
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '',
    makeModel: '',
    type: 'Bus' as 'Bus' | 'Mini-Bus' | 'Van',
    capacity: 40,
    fuelType: 'CNG' as 'Diesel' | 'CNG' | 'Electric',
    insuranceExpiry: '2027-06-30',
    fitnessExpiry: '2027-06-30',
    status: 'Active' as 'Active' | 'Under Maintenance' | 'Inactive'
  });

  const [routeForm, setRouteForm] = useState({
    routeNumber: '',
    name: '',
    startPoint: '',
    endPoint: 'Greenfield Main Campus Gate',
    busId: 'veh-01',
    driverId: 'drv-01',
    conductorName: 'Sunil Paswan',
    capacity: 40,
    morningStart: '06:45 AM',
    afternoonStart: '02:30 PM',
    operatingDays: 'Monday - Friday',
    status: 'Active' as 'Active' | 'On Route' | 'Maintenance' | 'Inactive',
    stopsText: 'Stop 1 (06:45 AM), Stop 2 (07:05 AM), Greenfield Main Gate (07:35 AM)'
  });

  const [assignmentForm, setAssignmentForm] = useState({
    studentId: students[0]?.id || 'std-8a-01',
    routeId: 'route-1',
    pickupStopId: 'stp-101',
    dropoffStopId: 'stp-101'
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicleId: 'veh-01',
    serviceType: 'Routine Brake & Lubrication Service',
    serviceDate: '2026-10-22',
    nextDueDate: '2027-01-22',
    cost: 320.0,
    serviceCenter: 'Authorized Commercial Fleet Center',
    status: 'Completed' as 'Completed' | 'In Progress' | 'Scheduled' | 'Overdue',
    notes: 'Engine fluids topped, brake pads inspected.'
  });

  const [incidentForm, setIncidentForm] = useState({
    routeId: 'route-1',
    category: 'Traffic Delay' as 'Traffic Delay' | 'Mechanical Breakdown' | 'Minor Scrape' | 'Student Misconduct' | 'Weather Detour',
    severity: 'Low' as 'Low' | 'Medium' | 'High',
    description: '',
    actionTaken: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    targetRoute: 'All Routes',
    priority: 'Normal' as 'Normal' | 'Urgent'
  });

  // Data-Derived Dashboard Metrics
  const totalVehiclesCount = vehicles.length;
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'Active').length;
  const maintenanceVehiclesCount = vehicles.filter((v) => v.status === 'Under Maintenance').length;
  const totalRoutesCount = routes.length;
  const totalStudentsAssignedCount = studentAssignments.length + 138; // Shared institutional commute baseline
  const totalFleetCapacity = routes.reduce((sum, r) => sum + r.capacity, 0);
  const fleetUtilizationRate = Math.round(
    (routes.reduce((sum, r) => sum + r.assignedCount, 0) / (totalFleetCapacity || 1)) * 100
  );
  const activeIncidentsCount = incidents.filter((i) => i.status === 'Under Investigation').length;

  // Selected route for roster
  const selectedRosterRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRosterRouteId) || routes[0];
  }, [routes, selectedRosterRouteId]);

  // Handle open Add Vehicle
  const handleOpenAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({
      registrationNumber: `DL-01-EA-${Math.floor(1000 + Math.random() * 9000)}`,
      makeModel: 'Tata Starbus 40-Seater',
      type: 'Bus',
      capacity: 40,
      fuelType: 'CNG',
      insuranceExpiry: '2027-08-30',
      fitnessExpiry: '2027-08-30',
      status: 'Active'
    });
    setShowAddVehicleModal(true);
  };

  // Handle Save Vehicle
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.registrationNumber.trim() || !vehicleForm.makeModel.trim()) {
      addToast({ type: 'error', title: 'Validation Failed', message: 'Registration number and vehicle make are required.' });
      return;
    }

    if (Number(vehicleForm.capacity) <= 0) {
      addToast({ type: 'error', title: 'Invalid Capacity', message: 'Vehicle seat capacity must be a positive number.' });
      return;
    }

    // Check duplicate plate
    if (!editingVehicle && vehicles.some((v) => v.registrationNumber.toLowerCase() === vehicleForm.registrationNumber.trim().toLowerCase())) {
      addToast({ type: 'error', title: 'Duplicate Registration', message: 'Vehicle plate is already registered.' });
      return;
    }

    if (editingVehicle) {
      const updated = vehicles.map((v) =>
        v.id === editingVehicle.id
          ? {
              ...v,
              registrationNumber: vehicleForm.registrationNumber,
              makeModel: vehicleForm.makeModel,
              type: vehicleForm.type,
              capacity: Number(vehicleForm.capacity),
              fuelType: vehicleForm.fuelType,
              insuranceExpiry: vehicleForm.insuranceExpiry,
              fitnessExpiry: vehicleForm.fitnessExpiry,
              status: vehicleForm.status
            }
          : v
      );
      setVehicles(updated);

      logAuditEvent({
        actorRole: 'transport',
        actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
        action: 'UPDATE_VEHICLE_RECORD',
        module: 'transport',
        recordRef: editingVehicle.id,
        status: 'SUCCESS',
        reason: `Updated vehicle particulars for ${vehicleForm.registrationNumber}`
      });

      addToast({ type: 'success', title: 'Vehicle Record Updated', message: `Plate ${vehicleForm.registrationNumber} updated.` });
    } else {
      const newVeh: Vehicle = {
        id: `veh-${Date.now()}`,
        registrationNumber: vehicleForm.registrationNumber,
        makeModel: vehicleForm.makeModel,
        type: vehicleForm.type,
        capacity: Number(vehicleForm.capacity),
        status: vehicleForm.status,
        insuranceExpiry: vehicleForm.insuranceExpiry,
        fitnessExpiry: vehicleForm.fitnessExpiry,
        fuelType: vehicleForm.fuelType,
        lastServiceDate: '2026-10-20',
        gpsUnitId: `GPS-TRK-${vehicleForm.registrationNumber.slice(-4)}`
      };
      setVehicles([...vehicles, newVeh]);

      logAuditEvent({
        actorRole: 'transport',
        actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
        action: 'REGISTER_NEW_VEHICLE',
        module: 'transport',
        recordRef: newVeh.id,
        status: 'SUCCESS',
        reason: `Added new vehicle ${newVeh.registrationNumber} (${newVeh.makeModel})`
      });

      addToast({ type: 'success', title: 'Vehicle Enrolled', message: `${newVeh.makeModel} (${newVeh.registrationNumber}) added to fleet.` });
    }

    setShowAddVehicleModal(false);
  };

  // Handle open Add Route
  const handleOpenAddRoute = () => {
    setEditingRoute(null);
    setRouteForm({
      routeNumber: `R-0${routes.length + 1}`,
      name: '',
      startPoint: '',
      endPoint: 'Greenfield Main Campus Gate',
      busId: vehicles[0]?.id || 'veh-01',
      driverId: drivers[0]?.id || 'drv-01',
      conductorName: attendants[0]?.name || 'Sunil Paswan',
      capacity: 40,
      morningStart: '06:45 AM',
      afternoonStart: '02:30 PM',
      operatingDays: 'Monday - Friday',
      status: 'Active',
      stopsText: 'Stop 1 (06:45 AM), Stop 2 (07:05 AM), Greenfield Main Gate (07:35 AM)'
    });
    setShowAddRouteModal(true);
  };

  // Handle Save Route
  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.routeNumber.trim() || !routeForm.name.trim() || !routeForm.startPoint.trim()) {
      addToast({ type: 'error', title: 'Validation Failed', message: 'Route number, name, and starting point are required.' });
      return;
    }

    const matchedBus = vehicles.find((v) => v.id === routeForm.busId);
    const matchedDriver = drivers.find((d) => d.id === routeForm.driverId);

    // Safeguard: Vehicle availability check
    if (matchedBus && matchedBus.status === 'Under Maintenance') {
      addToast({
        type: 'error',
        title: 'Vehicle Unavailable',
        message: `${matchedBus.registrationNumber} is Under Maintenance. Please select an Active fleet vehicle.`
      });
      return;
    }

    const stopStrings = routeForm.stopsText.split(',').map((s) => s.trim()).filter(Boolean);
    if (stopStrings.length < 2) {
      addToast({ type: 'error', title: 'Stops Required', message: 'A route must specify at least 2 ordered stops.' });
      return;
    }

    const parsedStops: TransportStop[] = stopStrings.map((s, idx) => ({
      id: `stp-gen-${Date.now()}-${idx + 1}`,
      routeId: editingRoute ? editingRoute.id : `route-${Date.now()}`,
      stopName: s.split('(')[0].trim(),
      landmark: 'Designated School Stop',
      morningPickupTime: s.includes('(') ? s.split('(')[1].replace(')', '').trim() : '07:00 AM',
      afternoonDropTime: '03:00 PM',
      sequence: idx + 1,
      studentsCount: idx === stopStrings.length - 1 ? 0 : 8
    }));

    if (editingRoute) {
      const updated = routes.map((r) =>
        r.id === editingRoute.id
          ? {
              ...r,
              routeNumber: routeForm.routeNumber,
              name: routeForm.name,
              startPoint: routeForm.startPoint,
              endPoint: routeForm.endPoint,
              busId: routeForm.busId,
              busNumber: matchedBus?.registrationNumber || r.busNumber,
              driverId: routeForm.driverId,
              driverName: matchedDriver?.name || r.driverName,
              driverPhone: matchedDriver?.phone || r.driverPhone,
              conductorName: routeForm.conductorName,
              capacity: Number(routeForm.capacity),
              morningStart: routeForm.morningStart,
              afternoonStart: routeForm.afternoonStart,
              operatingDays: routeForm.operatingDays,
              status: routeForm.status,
              stops: parsedStops
            }
          : r
      );
      setRoutes(updated);

      logAuditEvent({
        actorRole: 'transport',
        actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
        action: 'UPDATE_TRANSPORT_ROUTE',
        module: 'transport',
        recordRef: editingRoute.id,
        status: 'SUCCESS',
        reason: `Updated configuration for route ${routeForm.routeNumber}`
      });

      addToast({ type: 'success', title: 'Route Updated', message: `${routeForm.routeNumber} parameters saved.` });
    } else {
      const newRoute: TransportRoute = {
        id: `route-${Date.now()}`,
        routeNumber: routeForm.routeNumber,
        name: routeForm.name,
        startPoint: routeForm.startPoint,
        endPoint: routeForm.endPoint,
        busId: routeForm.busId,
        busNumber: matchedBus?.registrationNumber || 'DL-01-EA-4921',
        driverId: routeForm.driverId,
        driverName: matchedDriver?.name || 'Assigned Driver',
        driverPhone: matchedDriver?.phone || '+1 (555) 000-0000',
        conductorName: routeForm.conductorName,
        capacity: Number(routeForm.capacity),
        assignedCount: 0,
        morningStart: routeForm.morningStart,
        afternoonStart: routeForm.afternoonStart,
        operatingDays: routeForm.operatingDays,
        status: routeForm.status,
        stops: parsedStops
      };

      setRoutes([...routes, newRoute]);

      logAuditEvent({
        actorRole: 'transport',
        actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
        action: 'CREATE_TRANSPORT_ROUTE',
        module: 'transport',
        recordRef: newRoute.id,
        status: 'SUCCESS',
        reason: `Created new bus route ${newRoute.routeNumber} (${newRoute.name})`
      });

      addToast({ type: 'success', title: 'Route Configured', message: `${newRoute.routeNumber} created with ${parsedStops.length} stops.` });
    }

    setShowAddRouteModal(false);
  };

  // Handle Assign Student to Route Workflow
  const handleExecuteAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedStudent = students.find((s) => s.id === assignmentForm.studentId);
    if (!selectedStudent) {
      addToast({ type: 'error', title: 'Student Required', message: 'Please select an eligible student.' });
      return;
    }

    // Check duplicate assignment
    if (studentAssignments.some((a) => a.studentId === selectedStudent.id)) {
      addToast({
        type: 'error',
        title: 'Duplicate Assignment',
        message: `${selectedStudent.name} is already assigned to a route. Please modify the existing assignment.`
      });
      return;
    }

    const targetRoute = routes.find((r) => r.id === assignmentForm.routeId);
    if (!targetRoute) {
      addToast({ type: 'error', title: 'Route Required', message: 'Target route not found.' });
      return;
    }

    // Capacity Check
    if (targetRoute.assignedCount >= targetRoute.capacity) {
      addToast({
        type: 'error',
        title: 'Route at Full Capacity',
        message: `${targetRoute.routeNumber} has reached its maximum seat limit of ${targetRoute.capacity} students.`
      });
      return;
    }

    // Vehicle Availability Check
    const assignedBus = vehicles.find((v) => v.id === targetRoute.busId);
    if (assignedBus && assignedBus.status === 'Under Maintenance') {
      addToast({
        type: 'error',
        title: 'Assigned Vehicle Under Maintenance',
        message: `Bus ${assignedBus.registrationNumber} is undergoing maintenance. New student allocations are temporarily suspended.`
      });
      return;
    }

    const pickupStop = targetRoute.stops.find((s) => s.id === assignmentForm.pickupStopId) || targetRoute.stops[0];
    const dropoffStop = targetRoute.stops.find((s) => s.id === assignmentForm.dropoffStopId) || targetRoute.stops[0];

    const newAssignment: StudentTransportAssignment = {
      id: `sta-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      classId: selectedStudent.classId,
      className: selectedStudent.classId.replace('class-', 'Grade ').toUpperCase(),
      routeId: targetRoute.id,
      routeNumber: targetRoute.routeNumber,
      pickupStopId: pickupStop.id,
      pickupStopName: pickupStop.stopName,
      dropoffStopId: dropoffStop.id,
      dropoffStopName: dropoffStop.stopName,
      guardianContact: `${selectedStudent.parentPhone} (${selectedStudent.parentName})`,
      seatNumber: targetRoute.assignedCount + 1,
      status: 'Active',
      effectiveDate: '2026-10-22'
    };

    setStudentAssignments([newAssignment, ...studentAssignments]);

    // Increment assigned count on route
    const updatedRoutes = routes.map((r) => (r.id === targetRoute.id ? { ...r, assignedCount: r.assignedCount + 1 } : r));
    setRoutes(updatedRoutes);

    logAuditEvent({
      actorRole: 'transport',
      actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
      action: 'ASSIGN_STUDENT_TRANSPORT',
      module: 'transport',
      recordRef: newAssignment.id,
      status: 'SUCCESS',
      reason: `Assigned ${selectedStudent.name} to ${targetRoute.routeNumber} at stop "${pickupStop.stopName}"`
    });

    addToast({
      type: 'success',
      title: 'Transport Assigned Successfully',
      message: `${selectedStudent.name} allocated to ${targetRoute.routeNumber} (Stop: ${pickupStop.stopName}).`
    });

    setShowAssignStudentModal(false);
  };

  // Remove assignment
  const handleRemoveAssignment = (id: string) => {
    const target = studentAssignments.find((a) => a.id === id);
    if (!target) return;

    setStudentAssignments(studentAssignments.filter((a) => a.id !== id));

    // Decrement route count
    setRoutes(routes.map((r) => (r.id === target.routeId ? { ...r, assignedCount: Math.max(0, r.assignedCount - 1) } : r)));

    logAuditEvent({
      actorRole: 'transport',
      actorName: userProfiles.transport?.fullName || 'Gurpreet Singh',
      action: 'REMOVE_STUDENT_TRANSPORT',
      module: 'transport',
      recordRef: id,
      status: 'SUCCESS',
      reason: `De-allocated transport assignment for ${target.studentName}`
    });

    addToast({
      type: 'info',
      title: 'Assignment Removed',
      message: `${target.studentName} removed from ${target.routeNumber} manifest.`
    });
  };

  // Export CSV
  const handleExportTransportCSV = () => {
    const headers = ['Assignment ID', 'Student Name', 'Class', 'Route Code', 'Pickup Stop', 'Drop-off Stop', 'Guardian Contact', 'Status'];
    const rows = studentAssignments.map((a) => [
      a.id,
      `"${a.studentName.replace(/"/g, '""')}"`,
      a.className,
      a.routeNumber,
      `"${a.pickupStopName}"`,
      `"${a.dropoffStopName}"`,
      `"${a.guardianContact}"`,
      a.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCHLAR_Transport_Roster_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Transport Roster Exported',
      message: 'Student commute manifest CSV file generated and downloaded.'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Role Sidebar */}
      <RoleSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAction={() => {
          setAssignmentForm({
            studentId: students[0]?.id || 'std-8a-01',
            routeId: routes[0]?.id || 'route-1',
            pickupStopId: routes[0]?.stops[0]?.id || 'stp-101',
            dropoffStopId: routes[0]?.stops[0]?.id || 'stp-101'
          });
          setShowAssignStudentModal(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ================= 1. PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= 2. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transport & Fleet Operations</h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-theme-light text-theme-primary border border-theme-border">
                    Fleet Dispatch & Logistics
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  School bus registers, licensed drivers, student route allocations, and safety maintenance logs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setAssignmentForm({
                      studentId: students[0]?.id || 'std-8a-01',
                      routeId: routes[0]?.id || 'route-1',
                      pickupStopId: routes[0]?.stops[0]?.id || 'stp-101',
                      dropoffStopId: routes[0]?.stops[0]?.id || 'stp-101'
                    });
                    setShowAssignStudentModal(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Student</span>
                </button>
                <button
                  onClick={handleOpenAddVehicle}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Add Vehicle</span>
                </button>
                <button
                  onClick={handleOpenAddRoute}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>New Route</span>
                </button>
              </div>
            </div>

            {/* KPI Cards (Derived from state) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('vehicles')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-theme-primary transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Vehicles</span>
                  <Bus className="w-4 h-4 text-theme-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalVehiclesCount}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">
                  {activeVehiclesCount} Active · {maintenanceVehiclesCount} Maintenance
                </div>
              </div>

              <div
                onClick={() => setActiveTab('routes')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-theme-secondary transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configured Routes</span>
                  <Clock className="w-4 h-4 text-theme-secondary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalRoutesCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">All operating Mon - Fri</div>
              </div>

              <div
                onClick={() => setActiveTab('student_assignments')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Commuters</span>
                  <GraduationCap className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-blue-700 mt-2 font-mono">{totalStudentsAssignedCount}</div>
                <div className="text-[11px] text-blue-600 font-medium mt-1">{fleetUtilizationRate}% Fleet Occupancy</div>
              </div>

              <div
                onClick={() => setActiveTab('maintenance')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-amber-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maintenance & Fitness</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-2 font-mono">100%</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Speed limiters & fitness certified</div>
              </div>
            </div>

            {/* Routes Summary & Quick Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Routes Live Summary */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Active Bus Route Schedules</h3>
                  </div>
                  <button onClick={() => setActiveTab('routes')} className="text-xs font-semibold text-theme-primary hover:underline">
                    View All Routes
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {routes.map((r) => {
                    const occPct = Math.round((r.assignedCount / r.capacity) * 100);
                    return (
                      <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-9 h-9 rounded-xl bg-theme-light text-theme-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {r.routeNumber}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Bus: <span className="font-mono text-slate-700">{r.busNumber}</span> · Driver: {r.driverName} ({r.driverPhone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div className="text-right">
                            <span className="text-slate-700 font-bold">{r.assignedCount} / {r.capacity}</span>
                            <span className="text-[10px] text-slate-400 block font-sans">Seats Occupied</span>
                          </div>
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-theme-primary h-full rounded-full" style={{ width: `${occPct}%` }} />
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Safety, Drivers & Attendants Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Safety & Incident Desk</h3>
                  </div>
                  <button onClick={() => setActiveTab('incidents')} className="text-xs font-semibold text-theme-primary hover:underline">
                    Incident Log
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active Safety Incidents:</span>
                    <span className="font-bold text-slate-900 font-mono">{activeIncidentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Licensed Heavy Drivers:</span>
                    <span className="font-bold text-emerald-700 font-mono">{drivers.length} Certified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">First-Aid Certified Escorts:</span>
                    <span className="font-bold text-emerald-700 font-mono">{attendants.length} Staff</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fast Navigation</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab('rosters')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-theme-primary" />
                      <span>Print Manifest</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('stops')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <MapPin className="w-4 h-4 text-theme-primary" />
                      <span>Route Stops</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <Wrench className="w-4 h-4 text-theme-primary" />
                      <span>Fleet Service</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('announcements')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <Bell className="w-4 h-4 text-theme-primary" />
                      <span>Notice Board</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. VEHICLE FLEET ================= */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Fleet Register</h1>
                <p className="text-xs text-slate-500 mt-1">Master register of school-owned buses, vans, fitness validities, and route assignments.</p>
              </div>

              <button
                onClick={handleOpenAddVehicle}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Vehicle</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by license plate number (e.g. DL-01) or make..."
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <select
                value={vehicleStatusFilter}
                onChange={(e) => setVehicleStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
              >
                <option value="all">All Operational Statuses</option>
                <option value="Active">Active in Fleet</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Registration Plate</th>
                      <th className="py-3 px-4">Vehicle Make & Model</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-center">Seat Capacity</th>
                      <th className="py-3 px-4">Assigned Route</th>
                      <th className="py-3 px-4">Driver Assigned</th>
                      <th className="py-3 px-4">Insurance Valid</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {vehicles
                      .filter((v) => {
                        const q = vehicleSearch.toLowerCase();
                        const matchesSearch =
                          v.registrationNumber.toLowerCase().includes(q) ||
                          v.makeModel.toLowerCase().includes(q);
                        const matchesStatus = vehicleStatusFilter === 'all' || v.status === vehicleStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{v.registrationNumber}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">{v.makeModel}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">Fuel: {v.fuelType}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700">
                              {v.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold">{v.capacity} Seats</td>
                          <td className="py-3 px-4">
                            {v.assignedRouteName ? (
                              <span className="font-medium text-slate-800">{v.assignedRouteName}</span>
                            ) : (
                              <span className="text-slate-400 italic">Unallocated (Spare)</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {v.driverName ? (
                              <div>
                                <span className="font-bold text-slate-900">{v.driverName}</span>
                                <span className="text-[11px] text-slate-500 block">{v.driverPhone}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{v.insuranceExpiry}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                v.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : v.status === 'Under Maintenance'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. DRIVERS & STAFF ================= */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Licensed Heavy Vehicle Drivers</h1>
                <p className="text-xs text-slate-500 mt-1">Roster of commercial drivers with heavy transport licenses, police verification, and medical fitness.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drivers.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{d.name}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">{d.staffId}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Licensed & Active
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Commercial License:</span>
                      <span className="font-mono font-bold text-slate-900">{d.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">License Validity:</span>
                      <span className="font-mono text-slate-700">{d.licenseExpiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Bus:</span>
                      <span className="font-bold text-slate-900">{d.assignedVehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Allocated Route:</span>
                      <span className="font-medium text-slate-800">{d.assignedRoute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Direct Phone:</span>
                      <span className="font-mono font-bold text-theme-primary">{d.phone}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Shift: {d.shift}</span>
                    <span className="text-emerald-700 font-medium">✓ {d.medicalStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. SUPPORT ATTENDANTS ================= */}
        {activeTab === 'transport_staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Attendants & Bus Conductors</h1>
                <p className="text-xs text-slate-500 mt-1">Escort staff responsible for boarding roll-calls, student safety, and emergency first response.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendants.map((att) => (
                <div key={att.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{att.name}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">{att.staffId}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-light text-theme-primary border border-theme-border">
                      Assigned to Route {att.route}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Primary Duty:</span>
                      <span className="font-medium text-slate-800">{att.duty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">First Aid Certification:</span>
                      <span className="font-bold text-emerald-700 font-mono">{att.firstAidCert}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile Phone:</span>
                      <span className="font-mono font-bold text-slate-900">{att.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. BUS ROUTES ================= */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configured Bus Routes</h1>
                <p className="text-xs text-slate-500 mt-1">Fixed pickup corridors, departure timings, and ordered sequence stops.</p>
              </div>

              <button
                onClick={handleOpenAddRoute}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure New Route</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((r) => {
                const occ = Math.round((r.assignedCount / r.capacity) * 100);
                return (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary font-bold text-xs flex items-center justify-center">
                          {r.routeNumber}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                          <span className="text-[11px] text-slate-500 font-mono">Bus: {r.busNumber}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Corridor Origin:</span>
                        <span className="font-bold text-slate-900">{r.startPoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">School Terminus:</span>
                        <span className="font-bold text-slate-900">{r.endPoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Driver & Phone:</span>
                        <span className="font-medium text-slate-800">{r.driverName} ({r.driverPhone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timings:</span>
                        <span className="font-mono text-slate-700">Morning {r.morningStart} · Afternoon {r.afternoonStart}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                        <span className="text-slate-500">Capacity Occupancy:</span>
                        <span className="font-mono font-bold text-slate-900">{r.assignedCount} / {r.capacity} ({occ}%)</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider mb-1">
                        Ordered Sequence Stops ({r.stops.length})
                      </span>
                      <div className="space-y-1">
                        {r.stops.map((s) => (
                          <div key={s.id} className="text-[11px] text-slate-600 flex justify-between">
                            <span>#{s.sequence}. {s.stopName}</span>
                            <span className="font-mono text-slate-500">{s.morningPickupTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 7. STOPS & SCHEDULES ================= */}
        {activeTab === 'stops' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stops & Schedule Matrices</h1>
                <p className="text-xs text-slate-500 mt-1">Designated passenger boarding checkpoints, arrival timetables, and student counts.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Route</th>
                      <th className="py-3 px-4">Stop Sequence</th>
                      <th className="py-3 px-4">Checkpoint Name</th>
                      <th className="py-3 px-4">Landmark / Location</th>
                      <th className="py-3 px-4">Morning Pickup</th>
                      <th className="py-3 px-4">Afternoon Drop</th>
                      <th className="py-3 px-4 text-center">Boarding Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {routes.flatMap((r) =>
                      r.stops.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-theme-primary font-mono">{r.routeNumber}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">Stop #{s.sequence}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{s.stopName}</td>
                          <td className="py-3 px-4 text-slate-600">{s.landmark}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700">{s.morningPickupTime}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{s.afternoonDropTime}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{s.studentsCount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. STUDENT TRANSPORT ASSIGNMENTS ================= */}
        {activeTab === 'student_assignments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Transport Allocations</h1>
                <p className="text-xs text-slate-500 mt-1">Bus seat allocations, designated boarding stops, and emergency guardian contact links.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportTransportCSV}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Manifest (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    setAssignmentForm({
                      studentId: students[0]?.id || 'std-8a-01',
                      routeId: routes[0]?.id || 'route-1',
                      pickupStopId: routes[0]?.stops[0]?.id || 'stp-101',
                      dropoffStopId: routes[0]?.stops[0]?.id || 'stp-101'
                    });
                    setShowAssignStudentModal(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Allocate Student</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, class, or stop name..."
                  value={assignmentSearch}
                  onChange={(e) => setAssignmentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <select
                value={assignmentRouteFilter}
                onChange={(e) => setAssignmentRouteFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
              >
                <option value="all">All Bus Routes</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.routeNumber} ({r.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Student Particulars</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Route</th>
                      <th className="py-3 px-4">Pickup Stop</th>
                      <th className="py-3 px-4">Drop-off Stop</th>
                      <th className="py-3 px-4">Guardian Contact</th>
                      <th className="py-3 px-4 text-center">Seat #</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {studentAssignments
                      .filter((a) => {
                        const q = assignmentSearch.toLowerCase();
                        const matchesSearch =
                          a.studentName.toLowerCase().includes(q) ||
                          a.className.toLowerCase().includes(q) ||
                          a.pickupStopName.toLowerCase().includes(q);
                        const matchesRoute = assignmentRouteFilter === 'all' || a.routeId === assignmentRouteFilter;
                        return matchesSearch && matchesRoute;
                      })
                      .map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{a.studentName}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{a.className}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-theme-primary font-mono">{a.routeNumber}</span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{a.pickupStopName}</td>
                          <td className="py-3 px-4 text-slate-600">{a.dropoffStopName}</td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{a.guardianContact}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                            {a.seatNumber ? `#${a.seatNumber}` : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveAssignment(a.id)}
                              title="Remove assignment"
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 9. ROUTE ROSTERS ================= */}
        {activeTab === 'rosters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Route Commute Rosters</h1>
                <p className="text-xs text-slate-500 mt-1">Official printable passenger manifests for morning and afternoon roll calls.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedRosterRouteId}
                  onChange={(e) => setSelectedRosterRouteId(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeNumber} — {r.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Manifest</span>
                </button>
              </div>
            </div>

            {/* Roster Manifest Paper Sheet */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Manifest Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wider">Greenfield International School</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedRosterRoute.routeNumber}: {selectedRosterRoute.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Assigned Vehicle: <span className="font-mono font-bold text-slate-700">{selectedRosterRoute.busNumber}</span> · Driver: {selectedRosterRoute.driverName} ({selectedRosterRoute.driverPhone})
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono font-bold text-slate-900">
                    {selectedRosterRoute.assignedCount} / {selectedRosterRoute.capacity} Seats Allocated
                  </span>
                  <span className="text-slate-500 block text-[11px]">Conductor: {selectedRosterRoute.conductorName}</span>
                </div>
              </div>

              {/* Passenger Manifest by Stops */}
              <div className="space-y-4">
                {selectedRosterRoute.stops.map((stop) => {
                  const studentsAtStop = studentAssignments.filter(
                    (a) => a.routeId === selectedRosterRoute.id && a.pickupStopName === stop.stopName
                  );

                  return (
                    <div key={stop.id} className="border border-slate-200/80 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-3 flex items-center justify-between text-xs border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-theme-primary text-white font-bold text-[10px] flex items-center justify-center font-mono">
                            {stop.sequence}
                          </span>
                          <span className="font-bold text-slate-900">{stop.stopName}</span>
                          <span className="text-slate-500 text-[11px]">({stop.landmark})</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">Pickup: {stop.morningPickupTime}</span>
                      </div>

                      <div className="p-3 text-xs">
                        {studentsAtStop.length === 0 ? (
                          <span className="text-slate-400 italic">No students allocated for this pickup point.</span>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {studentsAtStop.map((std) => (
                              <div key={std.id} className="p-2 bg-slate-50/50 rounded-lg flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-900">{std.studentName}</span>
                                  <span className="text-[11px] text-slate-500 block">{std.className} · Seat #{std.seatNumber}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600">{std.guardianContact.split('(')[0]}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. VEHICLE MAINTENANCE ================= */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Maintenance & RTO Fitness</h1>
                <p className="text-xs text-slate-500 mt-1">Certified service logs, speed governor calibrations, brake checks, and overhaul schedules.</p>
              </div>

              <button
                onClick={() => setShowAddMaintenanceModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Service Voucher</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Vehicle Plate</th>
                      <th className="py-3 px-4">Service Description</th>
                      <th className="py-3 px-4">Service Date</th>
                      <th className="py-3 px-4">Next Due Date</th>
                      <th className="py-3 px-4">Authorized Service Depot</th>
                      <th className="py-3 px-4">Cost</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {maintenanceRecords.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{m.registrationNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{m.serviceType}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{m.serviceDate}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{m.nextDueDate}</td>
                        <td className="py-3 px-4 text-slate-700">{m.serviceCenter}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">${m.cost.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              m.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : m.status === 'In Progress'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 11. TRANSPORT INCIDENTS ================= */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transport Safety Incident Desk</h1>
                <p className="text-xs text-slate-500 mt-1">Controlled audit of traffic delays, mechanical malfunctions, and corrective actions taken.</p>
              </div>

              <button
                onClick={() => setShowAddIncidentModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Incident</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Incident Ref</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Route & Vehicle</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Action Taken</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {incidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inc.incidentNumber}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {inc.date} {inc.time}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-theme-primary">{inc.routeNumber || 'R-01'}</span>
                          <span className="text-[11px] text-slate-500 block font-mono">{inc.vehicleRegistration}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                            {inc.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs text-slate-700">{inc.description}</td>
                        <td className="py-3 px-4 max-w-xs text-slate-600 text-[11px]">{inc.actionTaken}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {inc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 12. ANNOUNCEMENTS ================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transport Circulars & Announcements</h1>
                <p className="text-xs text-slate-500 mt-1">Route detour bulletins, seasonal timing adjustments, and weather commute alerts.</p>
              </div>

              <button
                onClick={() => setShowAddAnnouncementModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-theme-primary" />
                      <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ann.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{ann.message}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: {ann.targetRoute}</span>
                    <span>Published: {ann.publishDate} by {ann.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 13. TRANSPORT REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transport Analytics & Logistics Reports</h1>
                <p className="text-xs text-slate-500 mt-1">Fleet utilization matrices, seat capacity audits, and maintenance expenditure logs.</p>
              </div>

              <button
                onClick={handleExportTransportCSV}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Master Commute Report (CSV)</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Fleet Seat Utilization</span>
                <div className="text-2xl font-black text-slate-900 font-mono">{fleetUtilizationRate}%</div>
                <p className="text-xs text-slate-500">Average seat occupancy across all 4 morning inbound and afternoon outbound corridors.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Commute Footprint</span>
                <div className="text-2xl font-black text-theme-primary font-mono">{totalStudentsAssignedCount} Students</div>
                <p className="text-xs text-slate-500">Total student population registered for campus bus transit across 16 sector stops.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Safety Compliance Index</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">100% Valid</div>
                <p className="text-xs text-slate-500">Zero active safety violations; speed governors and heavy licenses 100% current.</p>
              </div>
            </div>

            {/* Route-wise efficiency */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Route Efficiency Breakdown</h3>
              <div className="divide-y divide-slate-100">
                {routes.map((r) => {
                  const pct = Math.round((r.assignedCount / r.capacity) * 100);
                  return (
                    <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{r.routeNumber}: {r.name}</h4>
                        <span className="text-[11px] text-slate-500">Bus {r.busNumber} · {r.driverName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-slate-600">{r.assignedCount} / {r.capacity} seats</span>
                        <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-theme-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-right font-bold text-slate-700">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* 1. Register / Edit Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingVehicle ? 'Edit Vehicle Details' : 'Register Vehicle in Fleet'}
              </h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration Plate *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-01-EA-4921"
                  value={vehicleForm.registrationNumber}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Make & Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Starbus 40-Seater"
                  value={vehicleForm.makeModel}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, makeModel: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Bus">Standard Bus</option>
                    <option value="Mini-Bus">Mini-Bus</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seat Capacity *</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    required
                    value={vehicleForm.capacity}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="CNG">CNG</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operational Status</label>
                  <select
                    value={vehicleForm.status}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Configure Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingRoute ? 'Edit Route Details' : 'Configure Bus Route'}
              </h3>
              <button onClick={() => setShowAddRouteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Route Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R-05"
                    value={routeForm.routeNumber}
                    onChange={(e) => setRouteForm({ ...routeForm, routeNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Route Corridor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. South Meadows & Hill View"
                    value={routeForm.name}
                    onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Starting Point *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Meadows Rotary"
                    value={routeForm.startPoint}
                    onChange={(e) => setRouteForm({ ...routeForm, startPoint: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">School Terminus</label>
                  <input
                    type="text"
                    readOnly
                    value={routeForm.endPoint}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Vehicle</label>
                  <select
                    value={routeForm.busId}
                    onChange={(e) => setRouteForm({ ...routeForm, busId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id} disabled={v.status === 'Under Maintenance'}>
                        {v.registrationNumber} ({v.makeModel}) {v.status === 'Under Maintenance' ? '[MAINTENANCE]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Driver</label>
                  <select
                    value={routeForm.driverId}
                    onChange={(e) => setRouteForm({ ...routeForm, driverId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ordered Sequence Stops (Comma Separated) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Stop 1 (06:45 AM), Stop 2 (07:05 AM), Greenfield Main Gate (07:35 AM)"
                  value={routeForm.stopsText}
                  onChange={(e) => setRouteForm({ ...routeForm, stopsText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRouteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  {editingRoute ? 'Save Route' : 'Configure Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Assign Student Modal */}
      {showAssignStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Allocate Student to Route</h3>
              <button onClick={() => setShowAssignStudentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssignStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={assignmentForm.studentId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {students.map((s) => {
                    const isAssigned = studentAssignments.some((a) => a.studentId === s.id);
                    return (
                      <option key={s.id} value={s.id} disabled={isAssigned}>
                        {s.name} ({s.classId.replace('class-', 'Grade ').toUpperCase()}) {isAssigned ? '[ALREADY ASSIGNED]' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Route *</label>
                <select
                  value={assignmentForm.routeId}
                  onChange={(e) => {
                    const r = routes.find((rt) => rt.id === e.target.value);
                    setAssignmentForm({
                      ...assignmentForm,
                      routeId: e.target.value,
                      pickupStopId: r?.stops[0]?.id || '',
                      dropoffStopId: r?.stops[0]?.id || ''
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.assignedCount >= r.capacity}>
                      {r.routeNumber} ({r.name}) — {r.assignedCount}/{r.capacity} Seats {r.assignedCount >= r.capacity ? '[FULL]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stop Selection */}
              {(() => {
                const targetR = routes.find((r) => r.id === assignmentForm.routeId) || routes[0];
                return (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Designated Pickup Stop *</label>
                    <select
                      value={assignmentForm.pickupStopId}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          pickupStopId: e.target.value,
                          dropoffStopId: e.target.value
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                    >
                      {targetR.stops.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.sequence}. {s.stopName} (Pickup: {s.morningPickupTime})
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Maintenance Modal */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Maintenance Voucher</h3>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedVeh = vehicles.find((v) => v.id === maintenanceForm.vehicleId) || vehicles[0];
                const newM: VehicleMaintenance = {
                  id: `maint-${Date.now()}`,
                  vehicleId: matchedVeh.id,
                  registrationNumber: matchedVeh.registrationNumber,
                  serviceType: maintenanceForm.serviceType,
                  serviceDate: maintenanceForm.serviceDate,
                  nextDueDate: maintenanceForm.nextDueDate,
                  cost: Number(maintenanceForm.cost),
                  serviceCenter: maintenanceForm.serviceCenter,
                  status: maintenanceForm.status,
                  notes: maintenanceForm.notes
                };

                setMaintenanceRecords([newM, ...maintenanceRecords]);

                // If marked In Progress or Under Maintenance, update vehicle status
                if (maintenanceForm.status === 'In Progress') {
                  setVehicles(vehicles.map((v) => (v.id === matchedVeh.id ? { ...v, status: 'Under Maintenance' } : v)));
                }

                addToast({
                  type: 'success',
                  title: 'Maintenance Logged',
                  message: `Service record logged for ${matchedVeh.registrationNumber}.`
                });

                setShowAddMaintenanceModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Vehicle</label>
                <select
                  value={maintenanceForm.vehicleId}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} ({v.makeModel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Description</label>
                <input
                  type="text"
                  required
                  value={maintenanceForm.serviceType}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, serviceType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Cost ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={maintenanceForm.cost}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={maintenanceForm.status}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress (Vehicle Taken Offline)</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMaintenanceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Incident Modal */}
      {showAddIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Transport Safety Incident</h3>
              <button onClick={() => setShowAddIncidentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedR = routes.find((r) => r.id === incidentForm.routeId) || routes[0];
                const newInc: TransportIncident = {
                  id: `inc-${Date.now()}`,
                  incidentNumber: `TR-INC-2026-${Math.floor(100 + Math.random() * 900)}`,
                  date: '2026-10-22',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  routeId: matchedR.id,
                  routeNumber: matchedR.routeNumber,
                  vehicleRegistration: matchedR.busNumber,
                  driverName: matchedR.driverName,
                  category: incidentForm.category,
                  severity: incidentForm.severity,
                  description: incidentForm.description,
                  actionTaken: incidentForm.actionTaken || 'Incident recorded and parents alerted.',
                  status: 'Resolved'
                };

                setIncidents([newInc, ...incidents]);
                addToast({
                  type: 'info',
                  title: 'Incident Logged',
                  message: `Incident ${newInc.incidentNumber} logged on ${matchedR.routeNumber}.`
                });
                setShowAddIncidentModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Route & Bus</label>
                <select
                  value={incidentForm.routeId}
                  onChange={(e) => setIncidentForm({ ...incidentForm, routeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeNumber} ({r.name}) — {r.busNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={incidentForm.category}
                    onChange={(e) => setIncidentForm({ ...incidentForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Traffic Delay">Traffic Delay</option>
                    <option value="Mechanical Breakdown">Mechanical Breakdown</option>
                    <option value="Minor Scrape">Minor Scrape</option>
                    <option value="Student Misconduct">Student Misconduct</option>
                    <option value="Weather Detour">Weather Detour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Taken</label>
                <input
                  type="text"
                  value={incidentForm.actionTaken}
                  onChange={(e) => setIncidentForm({ ...incidentForm, actionTaken: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddIncidentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Announcement Modal */}
      {showAddAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publish Transport Notice</h3>
              <button onClick={() => setShowAddAnnouncementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newAnn: TransportAnnouncement = {
                  id: `ann-${Date.now()}`,
                  title: announcementForm.title,
                  message: announcementForm.message,
                  targetRoute: announcementForm.targetRoute,
                  publishDate: '2026-10-22',
                  status: 'Published',
                  author: 'Gurpreet Singh (Transport Office)',
                  priority: announcementForm.priority
                };

                setAnnouncements([newAnn, ...announcements]);
                addToast({
                  type: 'success',
                  title: 'Notice Broadcasted',
                  message: `Transport advisory "${announcementForm.title}" published.`
                });
                setShowAddAnnouncementModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fog Detour Protocol"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Route</label>
                <select
                  value={announcementForm.targetRoute}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, targetRoute: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  <option value="All Routes">All Routes</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.routeNumber}>
                      {r.routeNumber} ({r.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please state timings, checkpoint changes, or advisory..."
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnnouncementModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
