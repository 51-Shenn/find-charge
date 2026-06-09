import { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import type { Station } from '@/types/database';
import type { RouteData, RouteStep } from '@/types/directions';

interface RoutePanelProps {
  station: Station;
  route: RouteData;
  onExit: () => void;
}

const SIGN_ARROWS: Record<number, string> = {
  0: '\u2191',
  1: '\u2197',
  2: '\u2192',
  3: '\u2198',
  4: '\u25A0',
  5: '\u25C9',
  6: '\u21BB',
  [-1]: '\u2196',
  [-2]: '\u2190',
  [-3]: '\u2199',
};

function getArrow(sign: number): string {
  return SIGN_ARROWS[sign] ?? '\u2191';
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatTime(milliseconds: number): string {
  const totalMinutes = Math.round(milliseconds / 60000);
  if (totalMinutes < 1) return 'less than 1 min';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

export function RoutePanel({ station, route, onExit }: RoutePanelProps) {
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleExit() {
    setVisible(false);
    setTimeout(onExit, 200);
  }

  const containerStyle = [
    styles.container,
    visible ? styles.containerVisible : styles.containerHidden,
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <Pressable style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.exitText}>{'\u2190'} Exit</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerStation} numberOfLines={1}>
            {station.name}
          </Text>
          <Text style={styles.headerMeta}>
            ~{formatTime(route.time)} &middot; {formatDistance(route.distance)}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.stepsList}
        contentContainerStyle={styles.stepsContent}
      >
        {route.steps
          .filter((step) => step.distance > 0 || step.sign === 4)
          .map((step, index) => (
            <StepRow key={index} step={step} isLast={step.sign === 4} />
          ))}
      </ScrollView>
    </View>
  );
}

function StepRow({ step, isLast }: { step: RouteStep; isLast: boolean }) {
  return (
    <View style={[styles.stepRow, isLast && styles.stepRowLast]}>
      <View style={styles.stepIcon}>
        <Text style={styles.stepArrow}>{getArrow(step.sign)}</Text>
      </View>
      <Text style={styles.stepInstruction} numberOfLines={2}>
        {step.instruction}
      </Text>
      <Text style={styles.stepDistance}>{formatDistance(step.distance)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '45%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s ease',
  },
  containerVisible: {
    transform: [{ translateY: 0 }],
  },
  containerHidden: {
    transform: [{ translateY: 300 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  exitButton: {
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  exitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4285F4',
  },
  headerInfo: {
    flex: 1,
  },
  headerStation: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  headerMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  stepsList: {
    flex: 1,
  },
  stepsContent: {
    paddingVertical: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepArrow: {
    fontSize: 14,
    color: '#4285F4',
  },
  stepInstruction: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginRight: 8,
  },
  stepDistance: {
    fontSize: 12,
    color: '#94a3b8',
    minWidth: 50,
    textAlign: 'right',
  },
});
