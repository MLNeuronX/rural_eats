"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Car, FileText, CreditCard, Clock, CheckCircle, ChevronRight, MapPin, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Vehicle Details", icon: Car },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Availability", icon: Clock },
  { id: 5, title: "Payment", icon: CreditCard },
]

export default function DriverOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(20)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Vehicle Info
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",

    // Documents
    driversLicense: null,
    insurance: null,
    vehicleRegistration: null,

    // Availability
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    availableTimeStart: "09:00",
    availableTimeEnd: "17:00",
    deliveryRadius: 10,

    // Payment
    accountName: "",
    accountNumber: "",
    routingNumber: "",

    // Agreements
    agreeTerms: false,
    agreeBackground: false,
    agreeIndependent: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (field: string, value: boolean) => {
    if (field.startsWith("availableDays.")) {
      const day = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        availableDays: {
          ...prev.availableDays,
          [day]: value,
        },
      }))
    } else {
      handleChange(field, value)
    }
  }

  const handleFileChange = (field: string, files: FileList | null) => {
    if (files && files.length > 0) {
      handleChange(field, files[0])
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setProgress((currentStep + 1) * 20)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setProgress((currentStep - 1) * 20)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      router.push("/driver/onboarding-success")
    } catch (error) {
      // Placeholder for error handling
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Anytown"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <select
                id="vehicleType"
                className="w-full p-2 border rounded-md"
                value={formData.vehicleType}
                onChange={(e) => handleChange("vehicleType", e.target.value)}
              >
                <option value="">Select vehicle type</option>
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="truck">Pickup Truck</option>
                <option value="van">Van</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleMake">Make</Label>
                <Input
                  id="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) => handleChange("vehicleMake", e.target.value)}
                  placeholder="Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => handleChange("vehicleModel", e.target.value)}
                  placeholder="Corolla"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={(e) => handleChange("vehicleYear", e.target.value)}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleChange("licensePlate", e.target.value)}
                  placeholder="ABC123"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md mt-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700">Vehicle Requirements</h4>
                  <ul className="text-sm text-blue-600 mt-1 list-disc list-inside">
                    <li>Vehicle must be 2005 or newer</li>
                    <li>Must have valid registration and insurance</li>
                    <li>Must be in good working condition</li>
                    <li>Bicycles only allowed in certain areas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driversLicense">Driver's License</Label>
              <Input
                id="driversLicense"
                type="file"
                onChange={(e) => handleFileChange("driversLicense", e.target.files)}
              />
              <p className="text-xs text-muted-foreground">
                Upload a clear photo of your driver's license (front and back)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Proof of Insurance</Label>
              <Input id="insurance" type="file" onChange={(e) => handleFileChange("insurance", e.target.files)} />
              <p className="text-xs text-muted-foreground">Upload your current insurance card or policy</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleRegistration">Vehicle Registration</Label>
              <Input
                id="vehicleRegistration"
                type="file"
                onChange={(e) => handleFileChange("vehicleRegistration", e.target.files)}
              />
              <p className="text-xs text-muted-foreground">Upload your vehicle registration document</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-md mt-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-700">Document Guidelines</h4>
                  <ul className="text-sm text-amber-600 mt-1 list-disc list-inside">
                    <li>All documents must be current and not expired</li>
                    <li>Images must be clear and all text legible</li>
                    <li>File formats: JPG, PNG, or PDF only</li>
                    <li>Maximum file size: 5MB per document</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Available Days</h3>
              <div className="grid grid-cols-7 gap-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                  <div key={day} className="flex flex-col items-center">
                    <Checkbox
                      id={day}
                      checked={formData.availableDays[day as keyof typeof formData.availableDays]}
                      onCheckedChange={(checked) => handleCheckboxChange(`availableDays.${day}`, checked as boolean)}
                    />
                    <Label htmlFor={day} className="text-xs mt-1 capitalize">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableTimeStart">Start Time</Label>
                <Input
                  id="availableTimeStart"
                  type="time"
                  value={formData.availableTimeStart}
                  onChange={(e) => handleChange("availableTimeStart", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTimeEnd">End Time</Label>
                <Input
                  id="availableTimeEnd"
                  type="time"
                  value={formData.availableTimeEnd}
                  onChange={(e) => handleChange("availableTimeEnd", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
                <span className="text-sm font-medium">{formData.deliveryRadius} miles</span>
              </div>
              <Input
                id="deliveryRadius"
                type="range"
                min="1"
                max="25"
                value={formData.deliveryRadius}
                onChange={(e) => handleChange("deliveryRadius", Number.parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 mile</span>
                <span>25 miles</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-md mt-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-700">Delivery Area</h4>
                  <p className="text-sm text-green-600 mt-1">
                    Your delivery radius determines how far you'll travel for deliveries. A larger radius means more
                    opportunities, but consider your vehicle's efficiency and travel costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                placeholder="123456789"
                type="password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber}
                onChange={(e) => handleChange("routingNumber", e.target.value)}
                placeholder="987654321"
              />
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
                />
                <Label htmlFor="agreeTerms" className="text-sm">
                  I agree to the Rural Eats Terms of Service and Privacy Policy
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeBackground"
                  checked={formData.agreeBackground}
                  onCheckedChange={(checked) => handleChange("agreeBackground", checked as boolean)}
                />
                <Label htmlFor="agreeBackground" className="text-sm">
                  I consent to a background check and understand it may take 3-5 business days
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeIndependent"
                  checked={formData.agreeIndependent}
                  onCheckedChange={(checked) => handleChange("agreeIndependent", checked as boolean)}
                />
                <Label htmlFor="agreeIndependent" className="text-sm">
                  I understand I am an independent contractor, not an employee of Rural Eats
                </Label>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h4 className="font-medium">Payment Schedule</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Payments are processed weekly. All earnings from Monday through Sunday will be deposited to your account
                on the following Friday.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.phone && formData.email && formData.address
      case 2:
        return formData.vehicleType && formData.vehicleMake && formData.vehicleModel
      case 3:
        // In a real app, we'd check if files are uploaded
        return true
      case 4:
        return Object.values(formData.availableDays).some((day) => day === true)
      case 5:
        return (
          formData.accountName &&
          formData.accountNumber &&
          formData.routingNumber &&
          formData.agreeTerms &&
          formData.agreeBackground &&
          formData.agreeIndependent
        )
      default:
        return false
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Driver Onboarding</CardTitle>
          <CardDescription>Complete your profile to start delivering with Rural Eats</CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>

        <CardContent>
          <div className="flex justify-between mb-6">
            {steps.map((step) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep === step.id
                      ? "text-primary"
                      : currentStep > step.id
                        ? "text-green-500"
                        : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      currentStep === step.id
                        ? "border-primary bg-primary/10"
                        : currentStep > step.id
                          ? "border-green-500 bg-green-100"
                          : "border-muted bg-muted/30"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                </div>
              )
            })}
          </div>

          {renderStep()}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Back
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handleSubmit} disabled={!isStepValid() || isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!isStepValid()}>
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
