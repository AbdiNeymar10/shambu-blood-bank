"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Hospital, User, Send, Loader2, CheckCircle2 } from "lucide-react";

export function BloodRequestForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: "",
    requirementDate: "",
    hospitalName: "",
    hospitalAddress: "",
    doctorName: "",
    doctorContact: "",
    requesterName: "",
    relationship: "",
    contactNumber: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.units || parseInt(formData.units) < 1) newErrors.units = "Valid units required";
    if (!formData.requirementDate) newErrors.requirementDate = "Date is required";
    
    if (!formData.hospitalName.trim()) newErrors.hospitalName = "Hospital name is required";
    if (!formData.hospitalAddress.trim()) newErrors.hospitalAddress = "Hospital address is required";
    if (!formData.doctorName.trim()) newErrors.doctorName = "Doctor name is required";
    if (!formData.doctorContact.trim()) newErrors.doctorContact = "Doctor contact is required";

    if (!formData.requesterName.trim()) newErrors.requesterName = "Your name is required";
    if (!formData.relationship.trim()) newErrors.relationship = "Relationship is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Your contact number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Standard Blood Request</h2>
            <p className="text-muted-foreground text-lg">
              Please fill out this form for non-emergency blood requirements. We strive to process all requests within 4-6 hours depending on inventory availability.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border shadow-lg rounded-2xl p-8 md:p-12 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">Request Received</h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Your request for <span className="font-bold text-foreground">{formData.bloodGroup}</span> blood has been successfully submitted. Our team is reviewing the inventory and will contact you at <span className="font-bold text-foreground">{formData.contactNumber}</span> within 4-6 hours.
                  </p>
                  <div className="bg-muted/50 p-6 rounded-lg w-full max-w-md border border-border text-left mb-8">
                    <h4 className="font-semibold text-foreground mb-2">Next Steps:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Keep your phone nearby.</li>
                      <li>Prepare relevant hospital documentation.</li>
                      <li>In case of a sudden emergency, please call 1-800-GIVE-LIFE immediately instead of waiting.</li>
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        patientName: "", bloodGroup: "", units: "", requirementDate: "",
                        hospitalName: "", hospitalAddress: "", doctorName: "", doctorContact: "",
                        requesterName: "", relationship: "", contactNumber: "", additionalNotes: "",
                      });
                    }}
                  >
                    Submit Another Request
                  </Button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10" 
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Patient Details */}
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
                      <User className="w-5 h-5 text-primary" />
                      Patient Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="patientName" className="text-sm font-medium">Patient Full Name</label>
                        <input 
                          id="patientName" 
                          type="text" 
                          value={formData.patientName}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.patientName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Enter patient name" 
                          aria-invalid={!!errors.patientName}
                        />
                        {errors.patientName && <p className="text-xs text-destructive mt-1">{errors.patientName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group Required</label>
                        <select 
                          id="bloodGroup" 
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background appearance-none transition-all outline-none focus:ring-2 ${errors.bloodGroup ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`}
                          aria-invalid={!!errors.bloodGroup}
                        >
                          <option value="">Select Blood Group...</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && <p className="text-xs text-destructive mt-1">{errors.bloodGroup}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="units" className="text-sm font-medium">Units Required</label>
                        <input 
                          id="units" 
                          type="number" 
                          min="1" max="10" 
                          value={formData.units}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.units ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="e.g. 2" 
                          aria-invalid={!!errors.units}
                        />
                        {errors.units && <p className="text-xs text-destructive mt-1">{errors.units}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="requirementDate" className="text-sm font-medium">Requirement Date</label>
                        <input 
                          id="requirementDate" 
                          type="date" 
                          value={formData.requirementDate}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.requirementDate ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`}
                          aria-invalid={!!errors.requirementDate}
                        />
                        {errors.requirementDate && <p className="text-xs text-destructive mt-1">{errors.requirementDate}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
                      <Hospital className="w-5 h-5 text-primary" />
                      Hospital Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="hospitalName" className="text-sm font-medium">Hospital Name</label>
                        <input 
                          id="hospitalName" 
                          type="text" 
                          value={formData.hospitalName}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.hospitalName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Enter hospital name" 
                          aria-invalid={!!errors.hospitalName}
                        />
                        {errors.hospitalName && <p className="text-xs text-destructive mt-1">{errors.hospitalName}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="hospitalAddress" className="text-sm font-medium">Hospital Address</label>
                        <input 
                          id="hospitalAddress" 
                          type="text" 
                          value={formData.hospitalAddress}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.hospitalAddress ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Full address including city and pin code" 
                          aria-invalid={!!errors.hospitalAddress}
                        />
                        {errors.hospitalAddress && <p className="text-xs text-destructive mt-1">{errors.hospitalAddress}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="doctorName" className="text-sm font-medium">Doctor in Charge</label>
                        <input 
                          id="doctorName" 
                          type="text" 
                          value={formData.doctorName}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.doctorName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Dr. Name" 
                          aria-invalid={!!errors.doctorName}
                        />
                        {errors.doctorName && <p className="text-xs text-destructive mt-1">{errors.doctorName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="doctorContact" className="text-sm font-medium">Doctor's Contact</label>
                        <input 
                          id="doctorContact" 
                          type="tel" 
                          value={formData.doctorContact}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.doctorContact ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Phone number" 
                          aria-invalid={!!errors.doctorContact}
                        />
                        {errors.doctorContact && <p className="text-xs text-destructive mt-1">{errors.doctorContact}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Requester Details */}
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
                      <FileText className="w-5 h-5 text-primary" />
                      Requester Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="requesterName" className="text-sm font-medium">Your Name</label>
                        <input 
                          id="requesterName" 
                          type="text" 
                          value={formData.requesterName}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.requesterName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Enter your name" 
                          aria-invalid={!!errors.requesterName}
                        />
                        {errors.requesterName && <p className="text-xs text-destructive mt-1">{errors.requesterName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="relationship" className="text-sm font-medium">Relationship to Patient</label>
                        <input 
                          id="relationship" 
                          type="text" 
                          value={formData.relationship}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.relationship ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="e.g. Family, Friend, Hospital Staff" 
                          aria-invalid={!!errors.relationship}
                        />
                        {errors.relationship && <p className="text-xs text-destructive mt-1">{errors.relationship}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
                        <input 
                          id="contactNumber" 
                          type="tel" 
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.contactNumber ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                          placeholder="Your active phone number" 
                          aria-invalid={!!errors.contactNumber}
                        />
                        {errors.contactNumber && <p className="text-xs text-destructive mt-1">{errors.contactNumber}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="additionalNotes" className="text-sm font-medium">Additional Notes (Optional)</label>
                        <textarea 
                          id="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={handleChange}
                          className="w-full min-h-[100px] p-4 rounded-md border border-input bg-background resize-y transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                          placeholder="Any specific instructions or medical details..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Button size="lg" className="w-full md:w-auto md:px-12 text-lg h-14" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4 text-center md:text-left">
                      By submitting this form, you authorize Shambu Blood Bank to contact the provided doctor/hospital to verify the request.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
