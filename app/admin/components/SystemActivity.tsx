"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity } from "lucide-react"

const SystemActivity = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            System Activity
          </CardTitle>
          <CardDescription>Recent platform events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* TODO: Replace with real system activity data from API */}
            <div className="text-center text-gray-500 py-8">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

SystemActivity.displayName = 'SystemActivity'

export default SystemActivity 