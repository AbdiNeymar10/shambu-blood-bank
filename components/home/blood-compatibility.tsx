"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type BloodGroupType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface CompatibilityData {
  givesTo: BloodGroupType[];
  receivesFrom: BloodGroupType[];
}

const compatibilityMap: Record<BloodGroupType, CompatibilityData> = {
  "A+": { givesTo: ["A+", "AB+"], receivesFrom: ["A+", "A-", "O+", "O-"] },
  "O+": { givesTo: ["O+", "A+", "B+", "AB+"], receivesFrom: ["O+", "O-"] },
  "B+": { givesTo: ["B+", "AB+"], receivesFrom: ["B+", "B-", "O+", "O-"] },
  "AB+": { givesTo: ["AB+"], receivesFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  "A-": { givesTo: ["A+", "A-", "AB+", "AB-"], receivesFrom: ["A-", "O-"] },
  "O-": { givesTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], receivesFrom: ["O-"] },
  "B-": { givesTo: ["B+", "B-", "AB+", "AB-"], receivesFrom: ["B-", "O-"] },
  "AB-": { givesTo: ["AB+", "AB-"], receivesFrom: ["AB-", "A-", "B-", "O-"] },
};

const allGroups: BloodGroupType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function BloodCompatibility() {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroupType>("O+");

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 font-medium text-sm mb-6"
          >
            <Info size={16} className="mr-2" />
            Education
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Blood Compatibility Matrix
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Select a blood type to see who they can donate to and receive from. Understanding compatibility is crucial for emergency transfusions.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto bg-card rounded-3xl border shadow-sm p-6 md:p-10 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {allGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl text-xl md:text-2xl font-bold transition-all duration-300 relative",
                    selectedGroup === group
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/30 scale-110 z-10"
                      : "bg-muted text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  )}
                >
                  {group}
                  {selectedGroup === group && (
                    <motion.div
                      layoutId="activeGroupIndicator"
                      className="absolute inset-0 rounded-2xl border-2 border-red-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Display Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Can Donate To */}
              <div className="bg-background rounded-3xl p-8 border">
                <h3 className="text-xl font-bold mb-6 flex items-center text-emerald-600 dark:text-emerald-400">
                  Can Donate To
                  <ArrowRight size={20} className="ml-2" />
                </h3>
                <div className="flex flex-wrap gap-4">
                  <AnimatePresence mode="popLayout">
                    {compatibilityMap[selectedGroup].givesTo.map((group) => (
                      <motion.div
                        key={`${selectedGroup}-gives-${group}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-lg border border-emerald-500/20"
                      >
                        {group}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {selectedGroup === "O-" && (
                  <p className="mt-4 text-sm text-muted-foreground">Universal Donor: Can give to anyone.</p>
                )}
              </div>

              {/* Can Receive From */}
              <div className="bg-background rounded-3xl p-8 border">
                <h3 className="text-xl font-bold mb-6 flex items-center text-blue-600 dark:text-blue-400">
                  <ArrowRight size={20} className="mr-2 rotate-180" />
                  Can Receive From
                </h3>
                <div className="flex flex-wrap gap-4">
                  <AnimatePresence mode="popLayout">
                    {compatibilityMap[selectedGroup].receivesFrom.map((group) => (
                      <motion.div
                        key={`${selectedGroup}-receives-${group}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-lg border border-blue-500/20"
                      >
                        {group}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {selectedGroup === "AB+" && (
                  <p className="mt-4 text-sm text-muted-foreground">Universal Recipient: Can receive from anyone.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
