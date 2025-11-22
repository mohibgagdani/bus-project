import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SeatLayout, Seat } from '@/types';
import { cn } from '@/lib/utils';

interface SeatLayoutBuilderProps {
  layout: SeatLayout;
  onChange: (layout: SeatLayout) => void;
}

export const SeatLayoutBuilder = ({ layout, onChange }: SeatLayoutBuilderProps) => {
  useEffect(() => {
    if (layout.seats.length === 0) {
      generateSeats();
    }
  }, []);

  const generateSeats = () => {
    const seats: Seat[] = [];
    let seatNumber = 1;
    
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.columns; col++) {
        seats.push({
          id: `seat-${row}-${col}`,
          number: seatNumber.toString(),
          row,
          col,
          isEnabled: true,
        });
        seatNumber++;
      }
    }
    
    onChange({ ...layout, seats });
  };

  const toggleSeat = (seatId: string) => {
    const updatedSeats = layout.seats.map(seat =>
      seat.id === seatId ? { ...seat, isEnabled: !seat.isEnabled } : seat
    );
    onChange({ ...layout, seats: updatedSeats });
  };

  const updateDimensions = (rows: number, columns: number) => {
    onChange({ ...layout, rows, columns, seats: [] });
    setTimeout(generateSeats, 0);
  };

  const enabledSeats = layout.seats.filter(s => s.isEnabled).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="5"
                max="20"
                value={layout.rows}
                onChange={(e) => updateDimensions(parseInt(e.target.value) || 10, layout.columns)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                min="2"
                max="6"
                value={layout.columns}
                onChange={(e) => updateDimensions(layout.rows, parseInt(e.target.value) || 4)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Click on seats to enable/disable them</span>
            <span className="font-medium">Total Seats: {enabledSeats}</span>
          </div>

          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded"></div>
              <span>Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded"></div>
              <span>Disabled</span>
            </div>
          </div>

          {layout.seats.length > 0 && (
            <div className="p-4 bg-gradient-to-b from-muted/50 to-background rounded-lg">
              <div className="text-center text-sm font-medium mb-4">Driver</div>
              <div className="grid gap-2" style={{ 
                gridTemplateColumns: `repeat(${layout.columns}, 1fr)` 
              }}>
                {layout.seats.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => toggleSeat(seat.id)}
                    className={cn(
                      "w-10 h-10 rounded text-xs font-medium transition-all hover:scale-110",
                      seat.isEnabled 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {layout.seats.length === 0 && (
            <Button type="button" onClick={generateSeats} className="w-full">
              Generate Seat Layout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
