import { NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notification-service'

// POST /api/notifications/send - Send notification
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { templateId, recipients, variables, priority = 'medium' } = body

    if (!templateId || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({
        success: false,
        error: 'Template ID and recipients are required'
      }, { status: 400 })
    }

    const results = await NotificationService.sendTemplateNotification({
      templateId,
      recipients,
      variables: variables || {},
      priority
    })

    return NextResponse.json({
      success: true,
      results,
      message: 'Notifications sent successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/notifications/templates - Get all notification templates
export async function GET(request: Request) {
  try {
    const templates = NotificationService.getAllTemplates()

    return NextResponse.json({
      success: true,
      data: templates
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
