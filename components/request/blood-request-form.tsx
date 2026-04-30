"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Hospital, User, Send } from "lucide-react";

export function BloodRequestForm() {
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
            className="bg-card border border-border shadow-lg rounded-2xl p-8 md:p-12"
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              
              {/* Patient Details */}
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  Patient Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Full Name</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Enter patient name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Group Required</label>
                    <select className="w-full h-11 px-4 rounded-md border border-input bg-background appearance-none">
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
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Units Required</label>
                    <input type="number" min="1" max="10" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="e.g. 2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Requirement Date</label>
                    <input type="date" className="w-full h-11 px-4 rounded-md border border-input bg-background" />
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
                    <label className="text-sm font-medium">Hospital Name</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Enter hospital name" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Hospital Address</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Full address including city and pin code" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor in Charge</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Dr. Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor's Contact</label>
                    <input type="tel" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Phone number" />
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
                    <label className="text-sm font-medium">Your Name</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Relationship to Patient</label>
                    <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="e.g. Family, Friend, Hospital Staff" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Contact Number</label>
                    <input type="tel" className="w-full h-11 px-4 rounded-md border border-input bg-background" placeholder="Your active phone number" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Additional Notes (Optional)</label>
                    <textarea 
                      className="w-full min-h-[100px] p-4 rounded-md border border-input bg-background resize-y" 
                      placeholder="Any specific instructions or medical details..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button size="lg" className="w-full md:w-auto md:px-12 text-lg h-14">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request
                </Button>
                <p className="text-sm text-muted-foreground mt-4 text-center md:text-left">
                  By submitting this form, you authorize Shambu Blood Bank to contact the provided doctor/hospital to verify the request.
                </p>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
